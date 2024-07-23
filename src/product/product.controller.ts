import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from './dtos/product.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';
import { createProductParams } from './interface/product.interface';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getAllProducts();
  }

  @Get('/:productId')
  getSingleProduct(
    @Param('productId') productId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.getSingleProduct(productId);
  }

  @Post()
  @Roles(UserType.SELLER)
  addProduct(
    @Body() createProductDto: CreateProductDto,
    @User() user: UserEntity, // This user details will come from the interceptor
  ): Promise<ProductResponseDto> {
    return this.productService.addProduct(user?.userId, createProductDto);
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
