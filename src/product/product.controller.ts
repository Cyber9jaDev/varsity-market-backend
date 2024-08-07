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

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getAllProducts(
    @Query('searchText') searchText?: string,
    @Query('category') category?: CategoryType,
    @Query('location') location?: Location,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('orderBy') orderBy?: OrderByEnum,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ products: ProductResponseDto[]; totalPages: number }> {
    const categories = Object.values(CategoryType);
    const locations = Object.values(Location);

    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const createdAt =
      dateFrom || dateTo
        ? {
            ...(dateFrom && { gte: new Date(parseInt(dateFrom)) }),
            ...(dateTo && { lte: new Date(parseInt(dateTo)) }),
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

    const take = limit ? Math.max(1, parseInt(limit)) : 10; // Ensure a positive limit or default to 10 items per page
    const page_ = Math.max(1, parseInt(page)) || 1; // Ensure a positive page number or default to page 1
    const skip = (page_ - 1) * take;

    console.log(take);
    console.log(skip);

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

    const uploadPromises = productImages.map((image) =>
      this.cloudinaryService.uploadImage(image, 'unimarket/posts'),
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
