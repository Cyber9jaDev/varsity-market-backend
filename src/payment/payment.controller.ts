import { Body, Controller, Get, Post } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductService } from 'src/product/product.service';
import { initializePaymentDto } from './dtos/payment.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { ApiBody } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly productService: ProductService,
    private readonly databaseService: DatabaseService,
  ) {}


  @Post('/initialize')
  @ApiBody({
    required: true,
    description: "Create a subaccount for seller",
    type: initializePaymentDto
  })
  async initializePayment(
    @Body() initializePaymentDto: initializePaymentDto,
    @User() user: UserEntity,
  ) {
    // 1 Create a subaccount
    // 2 Initialize payment
  }

}
