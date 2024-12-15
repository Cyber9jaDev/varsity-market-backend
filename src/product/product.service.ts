import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductResponseDto } from './dtos/product.dto';
import {
  createProductParams,
  Filter,
  OrderBy,
  ProductImageParams,
  UpdateProductInterface,
} from './interface/product.interface';

const selectOptions = {
  id: true,
  name: true,
  description: true,
  price: true,
  condition: true,
  location: true,
  category: true,
  quantity: true,
  seller: { select: { name: true, phone: true, email: true } },
  images: { select: { secure_url: true } },
  createdAt: true,
};

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllProducts(
    filter: Filter,
    orderBy: OrderBy,
    take: number,
    skip: number,
  ): Promise<{ products: ProductResponseDto[]; countProducts: number }> {
    const countProducts = await this.databaseService.product.count({
      where: filter,
    });

    const products = await this.databaseService.product.findMany({
      take,
      skip,
      where: { ...filter },
      orderBy,
      select: { ...selectOptions },
    });

    return { products, countProducts };
  }

  async getAllUserProducts(userId: string): Promise<ProductResponseDto[]>{
    try {
      const products = await this.databaseService.product.findMany( { where: { sellerId: userId }, select: {...selectOptions} });
      return products;
    } catch (error) {
      throw new Error();
    }
  }

  async getSingleProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.databaseService.product.findUnique({
      where: { id },
      select: { ...selectOptions },
    });

    if (!product) throw new NotFoundException();

    return product;
  }

  async addProduct(
    sellerId: string,
    images: ProductImageParams[],
    { name, description, price, category, condition, location, quantity }: createProductParams ): Promise<ProductResponseDto> {
    
      return await this.databaseService.$transaction(async (db) => {
        const product = await db.product.create({
          data: { name, description, price, category, condition, location, sellerId, quantity },
          select: { ...selectOptions },
        });

        await db.image.createMany({
          data: images.map((image) => ({ ...image, productId: product.id })),
        });

        const createdImages = await db.image.findMany({
          where: { productId: product.id },
          select: { secure_url: true },
        });

        return new ProductResponseDto({ ...product, images: createdImages });
      });
  }

  async updateProduct(id: string, updateProductParams: UpdateProductInterface) {
    const updatedProduct = await this.databaseService.product.update({
      where: { id },
      data: { ...updateProductParams },
      select: { ...selectOptions },
    });

    if (!updatedProduct) throw new BadRequestException();

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    // To delete a product, we need to delete all the images associated with it first
    await this.databaseService.image.deleteMany({ where: { product: { id } } });

    const deletedProduct = await this.databaseService.product.delete({
      where: { id },
      select: { ...selectOptions },
    });

    if (!deletedProduct) throw new BadRequestException();

    return { message: 'Product deleted successfully', statusCode: 200 };
  }

  async findUserByProductId(id: string) {
    const product = await this.databaseService.product.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!product) throw new NotFoundException();

    return product;
  }
}
