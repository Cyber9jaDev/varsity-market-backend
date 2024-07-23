import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductResponseDto } from './dtos/product.dto';
import {
  createProductParams,
  UpdateProductInterface,
} from './interface/product.interface';

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

  async getSingleProduct(productId: string): Promise<ProductResponseDto> {
    const product = await this.databaseService.product.findUnique({
      where: { productId },
    });

    if (!product) throw new NotFoundException();
    console.log(product);

    return product;
  }

  async addProduct(
    sellerId: string,
    {
      name,
      description,
      price,
      category,
      condition,
      location,
      images,
    }: createProductParams,
  ): Promise<ProductResponseDto> {
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

  async updateProduct(
    productId: string,
    updateProductParams: UpdateProductInterface,
  ) {
    const updatedProduct = await this.databaseService.product.update({
      where: { productId },
      data: { ...updateProductParams },
    });

    if (!updatedProduct) throw new BadRequestException();

    return updatedProduct ;
  }

  async deleteProduct(productId: string) {
    // To delete a product, we need to delete all the images associated with it first
    await this.databaseService.image.deleteMany({
      where: {
        product: { productId },
      },
    });

    const deletedProduct = await this.databaseService.product.delete({
      where: { productId },
    });

    if (!deletedProduct) throw new BadRequestException();

    return deletedProduct;
  }

  async findUserByProductId(productId: string) {
    const product = await this.databaseService.product.findUnique({
      where: { productId },
      select: {
        sellerId: true,
        // seller: {
        //   select: { userId: true }
        // },
      },
    });

    if (!product) throw new NotFoundException();

    return product;
  }
}