import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dtos/cart.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserType.BUYER)
  @Post()
  addItemToCart(
    @Body() addItemToCartDto: AddItemToCartDto,
    @User() user: UserType
  ) {
    console.log(user);
    // return this.cartService.addItemToCart();
  }
}
