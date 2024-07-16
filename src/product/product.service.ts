import { Injectable } from '@nestjs/common';
import { Category, Condition } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

interface ProductParam{
  productName: string;
  description: string;
  price: number;
  category: Category
  condition: Condition
}

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService){}

  async getAllProducts(){
    const products = await this.databaseService.product.findMany({});
    return products;
  }

  async createProduct(body: ProductParam){
    const newProduct = await this.databaseService.product.create({
      data: { ...body }
    })
  }
}
