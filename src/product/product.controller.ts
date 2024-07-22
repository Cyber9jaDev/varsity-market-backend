import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponseDto } from './dtos/product.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getAllProducts();
  }

  @Get('/:productId')
  getSingleProduct(
    @Param('productId') productId: string
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
}
