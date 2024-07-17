import { Injectable } from '@nestjs/common';
import { CategoryType, ConditionType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ProductResponseDto } from './dtos/product.dto';
import { createProductParams } from './interface/product.interface';



@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService){}

  async getAllProducts(): Promise<ProductResponseDto[]>{
    const products = await this.databaseService.product.findMany({
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        category: true,
        condition: true,
        location: true,
        sellerId: true
      }
    });
    return products;
  }

  async createProduct({ name, description, price, category, condition, location, sellerId, images }: createProductParams) {
    return await this.databaseService.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          category,
          condition,
          location,
          sellerId
        },
        select: {
          productId: true,
          name: true,
          description: true,
          price: true,
          category: true,
          condition: true,
          location: true,
          sellerId: true,
        }
      });
  
      await prisma.image.createMany({
        data: images.map((image) => ({
          ...image,
          productImageId: product.productId
        }))
      });
  
      return product;
    });
  }
}
