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
import { SubaccountResponse } from './interface/payment.interface';

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
    });

    if (!product) {
      throw new UnauthorizedException('This product does not exist');
    }

    if (createSubaccountDto.quantity > product.quantity) {
      throw new BadRequestException(
        `Only ${product.quantity} items available in stock`,
      );
    }

    return await this.paymentService.createSubaccount();
  }
}
