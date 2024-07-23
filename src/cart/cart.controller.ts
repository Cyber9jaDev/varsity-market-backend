import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dtos/cart.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from '@prisma/client';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserType.BUYER)
  @Post()
  addItemToCart(
    @Body() addItemToCartDto: AddItemToCartDto
  ) {
    
    return this.cartService.addItemToCart();
    
  }
}
