import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/product.dto';

@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto){
    console.log(body);
    return this.productService.createProduct(body);
  }
}
