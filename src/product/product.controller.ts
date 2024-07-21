import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponseDto } from './dtos/product.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getAllProducts();
  }

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @User() user: UserEntity, // This user details will come from the interceptor
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(user?.userId, createProductDto);
  }
}
