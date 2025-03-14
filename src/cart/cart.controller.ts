import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemToCartDto, RemoveItemFromCartDto } from './dtos/cart.dto';
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
    @User() user: UserEntity,
  ) {
    return this.cartService.addItemToCart(user.userId, addItemToCartDto);
  }

  @Roles(UserType.BUYER)
  @Get()
  userCart(@User() user: UserEntity) {
    return this.cartService.userCart(user.userId);
  }

  @Roles(UserType.BUYER)
  @Delete()
  removeItemFromCart(
    @User() user: UserEntity,
    @Body() removeItemFromCartDto: RemoveItemFromCartDto,
  ) {
    return this.cartService.removeItemFromCart(
      user.userId,
      removeItemFromCartDto,
    );
  }
}
