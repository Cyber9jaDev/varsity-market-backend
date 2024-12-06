import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TransactionInitializationDto } from './dtos/payment.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { InitializeTransactionResponse } from './interface/payment.interface';
import { PaystackService } from './paystack/paystack.service';
import { Roles } from 'src/decorator/roles.decorator';
import { PaymentStatus, UserType } from '@prisma/client';

@Controller('payment')
export class PaymentController{
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paymentService: PaymentService,
    private readonly paystackService: PaystackService,
  ) {}

  @Get('/banks')
  async getBanks() {
    return await this.paystackService.bankList();
  }

  @Post('/initialize')
  @ApiBearerAuth()
  @Roles(UserType.BUYER, UserType.SELLER)
  @ApiBody({ required: true, description: 'Initiate Paystack Transaction', type: TransactionInitializationDto })
  async initializeTransaction(
    @Body() body: TransactionInitializationDto,
    @User() user: UserEntity
  ): Promise<InitializeTransactionResponse> {

    const buyer = await this.databaseService.user.findUnique({
      where: { id: user.userId },
    });

    if (!buyer) { throw new UnauthorizedException( 'You are not allowed to buy this product' ) }

    const product = await this.databaseService.product.findUnique({
      where: { id: body.productId },
      select: { id: true, seller: true, quantity: true, price: true },
    });

    if (!product) throw new NotFoundException('This product does not exist') 

    // Ensure a seller cannot buy their product
    if (product.seller.id === user.userId) throw new UnauthorizedException('You are not allowed to buy your product') 

    if (body.quantity > product.quantity) throw new BadRequestException( `Only ${product.quantity} items available for sale`) 

    // Verify Seller Account Details
    await this.paystackService.verifyAccountNumber(product.seller.accountNumber, product.seller.bankCode);

    // Fetch subaccount 
    await this.paymentService.fetchSubaccount(product.seller.subaccountCode);
    
    // Create a transaction record in the database with PENDING status
    const reference = this.generateReference();

    await this.databaseService.transaction.create({
      data:{
        buyerId: buyer.id,
        productId: product.id,
        quantity: body.quantity,
        amount: product.price,
        reference,
      }
    })

    // Initialize Transaction
    return await this.paymentService.initializeTransaction(buyer.email, body.quantity, product.price, product.seller.subaccountCode, reference, body.callback_url);
  }

  @Get("/verify/:reference")
  @ApiBearerAuth()
  @Roles(UserType.BUYER, UserType.SELLER)
  @ApiParam({ name: "reference", required: true, example: "TX-1733484067905-dtfisbbte" })
  async verifiedTransaction(@Param("reference") reference: string){
    if(!reference) throw new BadRequestException("Invalid reference code");

    // Check if transaction exists and it is successful

    const existingTransaction = await this.databaseService.transaction.findUnique({
      where: { reference }, 
      select: { 
        status: true, quantity: true, amount: true, verifiedAt: true, reference: true, 
        buyer: { select: { name: true } }, 
        product: { select: { id: true, name: true } }
      }
    });

    if(!existingTransaction) throw new NotFoundException("Transaction does not exist");

    if(existingTransaction.status === PaymentStatus.SUCCESS){
      return { ...existingTransaction, total: (existingTransaction.amount * existingTransaction.quantity) };
    }

    const verifyTransaction = await this.paymentService.verifyTransaction(reference)

    // Update product quantity
    if(verifyTransaction.data.status === "success") {
      try {
        // Update payment status
        const successfulTransaction = await this.databaseService.transaction.update({
          where: { reference },
          data: { status: PaymentStatus.SUCCESS },
          select: { 
            status: true, quantity: true, amount: true, verifiedAt: true, reference: true, 
            buyer: { select: { name: true } }, 
            product: { select: { id: true, name: true } }
          }
        });

        // Update payment quantity
        await this.databaseService.product.update({
          where: { id: existingTransaction.product.id },
          data: { quantity: { decrement: existingTransaction.quantity } },
        });

        return { ...successfulTransaction, total: (successfulTransaction.amount * successfulTransaction.quantity ) }
      } 
      catch (error) {
        throw new Error(error.message)
      }
    }
  }

  private generateReference(): string {
    return `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}