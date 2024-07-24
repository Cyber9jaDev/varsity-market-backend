import { BadGatewayException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddItemToCartParams } from './interface/cart.interface';

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addItemToCart(
    buyerId: string,
    { quantity, productId }: AddItemToCartParams,
  ) {
    try {
      const cart = await this.databaseService.cart.findUnique({
        where: { buyerId },
        include: { cartItems: true },
      });

      if (!cart) {
        // create a new cart
        await this.databaseService.cart.create({
          data: {
            buyer: {
              connect: { id: buyerId },
            },
          },
          include: { cartItems: true },
        });
      }

      const existingCartItem = await this.databaseService.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      if (existingCartItem) {
        await this.databaseService.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity },
          // data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        await this.databaseService.cartItem.create({
          data: {
            quantity,
            product: {
              connect: { id: productId },
            },
            cart: {
              connect: { buyerId },
            },
          },
        });
      }

      const updatedCart = await this.databaseService.cart.findUnique({
        where: { buyerId },
        include: { cartItems: true },
      });

      return updatedCart.cartItems;
    } catch (error) {
      throw new BadGatewayException();
    }
  }
}
