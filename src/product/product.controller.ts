import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductDto } from './dtos/product.dto';

@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  // @Post()
  // createProduct(@Body() product: createProductDto){

  // }
}
