import { BadRequestException, Body, Controller, Get, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InitializePaystackTransactionDto } from './dtos/payment.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { ApiBody } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreateSubaccountResponse, InitializeTransactionResponse } from './interface/payment.interface';

@Controller('payment')
export class PaymentController {
  constructor(
    // private readonly productService: ProductService,
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/banks')
  async getBanks() {
    return await this.paymentService.getBanks();
  }

  @Post('/initialize-transaction')
  @ApiBody({ required: true, description: 'Initiate Paystack Transaction', type: InitializePaystackTransactionDto })
  async initializeTransaction(
    @Body() body: InitializePaystackTransactionDto,
    @User() user: UserEntity
  ): Promise<InitializeTransactionResponse> {
    
    const buyer = await this.databaseService.user.findUnique({
      where: { id: user.userId },
    });

    if (!buyer) { throw new UnauthorizedException( 'You are not allowed to buy this product' ) }

    const product = await this.databaseService.product.findUnique({
      where: { id: body.productId },
      select: { seller: true, quantity: true, price: true },
    });

    if (!product) throw new NotFoundException('This product does not exist') 

    // Ensure a seller cannot buy their product
    if (product.seller.id === user.userId) throw new UnauthorizedException('You are not allowed to buy your product') 

    if (body.quantity > product.quantity) throw new BadRequestException( `Only ${product.quantity} items available in stock`) 

    // Verify Seller Account Details
    await this.paymentService.verifySellerBankAccount(product.seller);

    // Fetch subaccount 
    await this.paymentService.fetchSubaccount(product.seller.subaccountCode);

    // Initialize Transaction
    return await this.paymentService.initializeTransaction(buyer.email, body.quantity, (product.price), product.seller.subaccountCode);

  }
}
