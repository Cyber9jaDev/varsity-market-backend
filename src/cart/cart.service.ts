import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddItemToCartParams } from './interface/cart.interface';

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addItemToCart(
    productId: string,
    buyerId: string,
    { quantity }: AddItemToCartParams,
  ) {
    try {
      // Find the user cart
      const cart = await this.databaseService.cart.findUnique({
        where: { buyerId },
        include: { cartItems: true },
      });

      if (!cart) {
        // create a new cart
        await this.databaseService.cart.create({
          data: {
            buyer: {
              connect: { id: buyerId }
            }
          },
          include: { cartItems: true }
        });
      }

      // Check if the product is already in the cart
      const existingCartItem = await this.databaseService.cartItem.findFirst({
        where: { 
          cartId: cart.id,
          productId,
        },
      });

      if(existingCartItem) {
        console.log(existingCartItem);
        // Update the cart Item ( Quantity and the likes )
        await this.databaseService.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity }
        });
      } 

      else{
        const newCartItem = await this.databaseService.cartItem.create({
          data: {
            quantity,
            product: {
              connect: { id: productId }
            },
            cart: {
              connect: { buyerId }
            }
          }
        });
        return newCartItem
      }

      const updatedCart = await this.databaseService.cart.findUnique({
        where: { buyerId },
        include: { cartItems: true }
      });

      return updatedCart.cartItems;

    } catch (error) {}
  }
}
