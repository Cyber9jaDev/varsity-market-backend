import { Injectable } from '@nestjs/common';
import { CategoryType, ConditionType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

interface ProductParam{
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  condition: ConditionType,
  location: string,
  sellerId: string
}

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService){}

  async getAllProducts(){
    const products = await this.databaseService.product.findMany({});
    return products;
  }

  async createProduct({ name, description, price, category, condition, location, sellerId }: ProductParam){
  // async createProduct(body: ProductParam){
    // const newProduct = await this.databaseService.product.create({
    //   data: { 
    //     name: name,
    //     description,
    //     price,
    //     category,
    //     condition,
    //     location,
    //     sellerId
    //   }
    // })
    // return newProduct
    console.log(name);
    console.log(description);
    console.log(price);
    console.log(category);
    console.log(condition);
    console.log(location);
    console.log(sellerId);
    return name
  }
}
