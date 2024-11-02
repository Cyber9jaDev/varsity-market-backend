import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from './dtos/product.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { CategoryType, Location, UserType } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { OrderByEnum } from './interface/product.interface';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @ApiQuery({ example: 'Toyota Camry', required: false, name: 'searchText', type: "string" })
  @ApiQuery({ required: false, name: 'category', enum: CategoryType})
  @ApiQuery({ required: false, name: 'orderBy', enum: OrderByEnum})
  @ApiQuery({ required: false, name: 'location', enum: Location })
  @ApiQuery({ example: 10000, required: false, name: 'minPrice', type: "number" })
  @ApiQuery({ example: 500000, required: false, name: 'maxPrice', type: "number" })
  @ApiQuery({ example: '2020-08-12T16:16:32.282Z', required: false, name: 'dateFrom', type: Date })
  @ApiQuery({ example: '2024-08-12T16:16:32.282Z', required: false, name: 'dateTo', type: Date })
  @ApiQuery({ example: 1, required: false, name: 'page', type: "page number" })
  @ApiQuery({ example: 5, required: false, name: 'limit', type: "number", description: "Number of products to be returned per page" })
  @ApiResponse({
    status: 200,
    description: 'Ok',
    schema: {
      example: {
        id: '02b4c5a9-aef2-4189-8f0e-aa75df03f4b6',
        email: 'seller4@gmail.com',
        name: 'Seller 4',
        phone: '8013428022',
        userType: 'SELLER',
        token: 'Token',
      },
    },
  })

  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  async getAllProducts(
    @Query('searchText') searchText?: string,
    @Query('category') category?: CategoryType,
    @Query('location') location?: Location,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('orderBy') orderBy?: OrderByEnum,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ products: ProductResponseDto[]; totalPages: number }> {
    const categories = Object.values(CategoryType);
    const locations = Object.values(Location);

    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          }
        : undefined;

    const createdAt =
      dateFrom || dateTo
        ? {
            // ...(dateFrom && { gte: new Date(parseInt(dateFrom)) }),
            ...(dateFrom && { gte: new Date((dateFrom)) }),
            // ...(dateTo && { lte: new Date(parseInt(dateTo)) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          }
        : undefined;

    // Create a dynamic filter object, consisting of the queries passed
    const filter = {
      ...(searchText && { name: { search: searchText } }),
      ...(categories.includes(category) && { category }),
      ...(price && { price }),
      ...(locations.includes(location) && { location }),
      ...(createdAt && { createdAt }),
    };

    const orderProductsBy = {
      ...(orderBy && { price: orderBy }),
    };

    // const take = limit ? Math.max(1, parseInt(limit)) : 10; // Ensure a positive limit or default to 10 items per page
    const take = limit ? Math.max(1, limit) : 10; // Ensure a positive limit or default to 10 items per page
    // const page_ = Math.max(1, parseInt(page)) || 1; // Ensure a positive page number or default to page 1
    const page_ = Math.max(1, page) || 1; // Ensure a positive page number or default to page 1
    const skip = (page_ - 1) * take;

    const { products, countProducts } =
      await this.productService.getAllProducts(
        filter,
        orderProductsBy,
        take,
        skip,
      );

    return {
      products,
      totalPages: Math.ceil(countProducts / take), // Number of pages for pagination on the frontend
    };
  }

  // @Get('/:sellerId')
  // getProductsBySeller(): Promise<ProductResponseDto[]> {
  //   return this.productService.getAllProducts();
  // }

  @Get('/:productId')
  getSingleProduct(
    @Param('productId') productId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.getSingleProduct(productId);
  }

  @Post()
  @Roles(UserType.SELLER)
  @UseInterceptors(FilesInterceptor('productImages'))
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @User() user: UserEntity, // This user details will come from the interceptor
    @UploadedFiles() productImages: Express.Multer.File[],
  ): Promise<ProductResponseDto> {
    if (!productImages || productImages.length === 0) {
      throw new UnauthorizedException('Please upload at least one image');
    }

    // const uploadPromises = productImages.map((image) =>
    //   this.cloudinaryService.uploadImage(image, 'unimarket/posts'),
    // );

    const uploadPromises = productImages.map(
      async (image) =>
        await this.cloudinaryService.uploadImage(image, 'unimarket/posts'),
    );

    const uploadedImages = await Promise.all(uploadPromises);

    if (!uploadedImages)
      throw new BadRequestException('Error uploading images');

    const images = uploadedImages.map((image) => {
      return {
        secure_url: image.secure_url,
        public_id: image.public_id,
        asset_id: image.asset_id,
      };
    });

    return this.productService.addProduct(
      user?.userId,
      images,
      createProductDto,
    );
  }

  @Put('/:productId')
  @Roles(UserType.SELLER)
  async updateProduct(
    @Param('productId') productId: string,
    @User() user: UserEntity,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.findUserByProductId(productId);

    if (product.sellerId !== user.userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this product.',
      );
    }

    return this.productService.updateProduct(productId, updateProductDto);
  }

  @Delete('/:productId')
  @Roles(UserType.SELLER)
  async deleteProduct(
    @Param('productId') productId: string,
    @User() user: UserEntity,
  ) {
    const product = await this.productService.findUserByProductId(productId);

    if (product.sellerId !== user.userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this product.',
      );
    }

    return this.productService.deleteProduct(productId);
  }
}
