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
    
    // Find the user cart
    const existingUserCart = await this.databaseService.cart.findUnique({
      where: { buyerId },
      include: { cartItems: true }
    });

    console.log(existingUserCart);

    if (!existingUserCart) {
      // create a new cart
      await this.databaseService.cart.create({
        // data: { buyerId },
        data: { 
          buyer: {
            connect: { id: buyerId }
          }
        },
      });
    }

    // Check if the product is already in the cart
    const existingCartItem = existingUserCart.cartItems.find( item => item.productId === productId)

    if(existingCartItem) {
      // Update the cart Item ( Quantity and the likes )
      await this.databaseService.cartItem.update({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity
        }
      });
    }

    const newCartItem = await this.databaseService.cartItem.create({
      data: {
        quantity,
        product: {
          connect: { id: productId }
        },
        cart: {
          connect: {
            buyerId
          }
        }
      }
    });
  }
}
