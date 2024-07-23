import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) {}
  
  async addItemToCart() {
    const cart = await this.databaseService.cartItem.create({
      data: {
        
      }
    })
    // return this.databaseService.cart.create()
  }
}
