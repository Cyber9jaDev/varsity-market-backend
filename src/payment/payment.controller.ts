import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductService } from 'src/product/product.service';
import { initializePaymentDto } from './dtos/payment.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { ApiBody } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly productService: ProductService,
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('/initialize')
  @ApiBody({
    required: true,
    description: 'Create a subaccount for seller',
    type: initializePaymentDto,
  })
  async initializePayment(
    @Body() initializePaymentDto: initializePaymentDto,
    @User() user: UserEntity,
  ) {
    // Check if buyer has an account
    const isRegisteredBuyer = await this.databaseService.user.findUnique({
      where: { id: user.userId },
    });

    if (!isRegisteredBuyer) {
      throw new UnauthorizedException(
        'You are not allowed to buy this product',
      );
    }

    const isExistingProduct = await this.databaseService.product.findUnique({
      where: { id: initializePaymentDto.productId },
    });

    if (!isExistingProduct) {
      throw new UnauthorizedException('This product does not exist');
    }

    if (initializePaymentDto.quantity > isExistingProduct.quantity) {
      throw new BadRequestException(
        `Only ${isExistingProduct.quantity} items available in stock`
      );
    }
    

    return this.paymentService.initializePayment();
  }
}
