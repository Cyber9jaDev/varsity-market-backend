import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponseDto } from './dtos/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getAllProducts();
  }

  @Post()
  createProduct( @Body() createproductDto: CreateProductDto ) {
    return this.productService.createProduct(createproductDto)
  }
}
