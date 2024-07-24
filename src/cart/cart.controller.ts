import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dtos/cart.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserType.BUYER)
  @Post()
  addItemToCart(
    @Body() addItemToCartDto: AddItemToCartDto,
    @User() user: UserEntity
  ) {
    // console.log(user);
    return this.cartService.addItemToCart("45387048-a9d3-409e-b1b4-ad655dd5e12d", user.userId, addItemToCartDto);
  }
}
