import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addItemToCart(buyerId: string) {
    const cart = await this.databaseService.cart.create({
      data: {
        buyer: {
          connect: { id: buyerId }
        },
      }
    })     
    // return this.databaseService.cart.creat() 
  }
}
