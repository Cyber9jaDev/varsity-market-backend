import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductResponseDto } from './dtos/product.dto';
import {
  createProductParams,
  FilterQueries,
  ProductImageParams,
  UpdateProductInterface,
} from './interface/product.interface';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllProducts(filter: FilterQueries): Promise<ProductResponseDto[]> {
    console.log(filter);

    const products = await this.databaseService.product.findMany({
      where: { ...filter },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        condition: true,
        location: true,
        sellerId: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return products;
  }

  async getSingleProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.databaseService.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException();
    console.log(product);

    return product;
  }

  async addProduct(
    sellerId: string,
    images: ProductImageParams[],
    {
      name,
      description,
      price,
      category,
      condition,
      location,
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
          id: true,
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
          productId: product.id,
        })),
      });
      return new ProductResponseDto(product);
    });
  }

  async updateProduct(id: string, updateProductParams: UpdateProductInterface) {
    const updatedProduct = await this.databaseService.product.update({
      where: { id },
      data: { ...updateProductParams },
    });

    if (!updatedProduct) throw new BadRequestException();

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    // To delete a product, we need to delete all the images associated with it first
    await this.databaseService.image.deleteMany({
      where: {
        product: { id },
      },
    });

    const deletedProduct = await this.databaseService.product.delete({
      where: { id },
    });

    if (!deletedProduct) throw new BadRequestException();

    return deletedProduct;
  }

  async findUserByProductId(id: string) {
    const product = await this.databaseService.product.findUnique({
      where: { id },
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
