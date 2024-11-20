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
import { CreateSubaccountDto } from './dtos/payment.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { ApiBody } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { createSubaccount } from '../helpers/helpers';

import {
  CreateSubaccount,
  SubaccountResponse,
} from './interface/payment.interface';
import { getBankCode } from 'src/helpers/helpers';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly productService: ProductService,
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
  ) {}


  @Get('/banks')
  async getBanks(){
    return await this.paymentService.getBanks();
  }

  @Post('/initialize-transaction')
  @ApiBody({
    required: true,
    description: 'Create a subaccount for seller',
    type: CreateSubaccountDto,
  })
  async createSubaccount(
    @Body() createSubaccountDto: CreateSubaccountDto,
    @User() user: UserEntity,
  ): Promise<SubaccountResponse> {
    // Check if buyer has an account
    const buyer = await this.databaseService.user.findUnique({
      where: { id: user.userId },
    });

    if (!buyer) {
      throw new UnauthorizedException(
        'You are not allowed to buy this product',
      );
    }

    const product = await this.databaseService.product.findUnique({
      where: { id: createSubaccountDto.productId },
      select: { seller: true, quantity: true },
    });

    if (!product) {
      throw new UnauthorizedException('This product does not exist');
    }

    if (createSubaccountDto.quantity > product.quantity) {
      throw new BadRequestException(
        `Only ${product.quantity} items available in stock`,
      );
    }

    const createSubaccount: CreateSubaccount = {
      business_name: product.seller.businessName,
      bank_code: getBankCode(product.seller.bankName),
      account_number: product.seller.accountNumber,
      percentage_charge: 2.5,
    };

    // return await createSubaccount();
    return await this.paymentService.createSubaccount(createSubaccount);
  }
}
