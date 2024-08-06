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

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllProducts(
    @Query('searchText') searchText?: string,
    @Query('category') category?: CategoryType,
    @Query('location') location?: Location,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date,
    @Query('page') page?: string,
  ): Promise<ProductResponseDto[]> {;

    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    // Create a dynamic filter object, consisting of the queries passed
    
    const filter = {
      ...(searchText && { searchText }),
      ...(category && { category }),
      ...(location && { location }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(sortBy && { sortBy }),
      ...(price && { price }),
      ...(location && { location }),
      ...(page && { page: parseInt(page) }),
    };

    return this.productService.getAllProducts(filter);
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
