import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductResponseDto } from './dtos/product.dto';
import { createProductParams } from './interface/product.interface';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllProducts(): Promise<ProductResponseDto[]> {
    const products = await this.databaseService.product.findMany({
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        category: true,
        condition: true,
        location: true,
        sellerId: true,
      },
    });
    return products;
  }

  async getSingleProduct(productId: string): Promise<ProductResponseDto>{
    const product = await this.databaseService.product.findUnique({
      where: { productId }
    });
    
    if(!product) throw new NotFoundException()
      console.log(product);

    return product
  }

  // Be careful with the use of transaction in case it fails
  // check the global config settings or documentation
  async addProduct(sellerId: string, {
    name, 
    description,
    price,
    category,
    condition,
    location,
    images,
  }: createProductParams ): Promise<ProductResponseDto> {
    return await this.databaseService.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          category,
          condition,
          location,
          sellerId,
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
        },
      });

      await prisma.image.createMany({
        data: images.map((image) => ({
          ...image,
          productImageId: product.productId,
        })),
      }); 
      return new ProductResponseDto(product);
    });
  }
}
