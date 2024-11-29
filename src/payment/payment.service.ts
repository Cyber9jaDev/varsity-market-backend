import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import { CreateSubaccountResponse, InitializeTransactionResponse } from './interface/payment.interface';
import { User } from '@prisma/client';
import { AuthParams } from 'src/user/interface/user.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async getBanks() {
    return await this.paystackService.bankList();
  }

  async initializeTransaction(buyerEmail: string, quantity: number, amount: number, subaccount: string){
    return await this.paystackService.initializeTransaction(buyerEmail, quantity, amount, subaccount);
  }

  async verifySellerBankAccount({ accountNumber, bankCode }: AuthParams) {
    return await this.paystackService.verifyAccountNumber( accountNumber, bankCode );
  }

  async createSubaccount(seller: Partial<User>): Promise<CreateSubaccountResponse> {
    return await this.paystackService.createSubaccount(seller);
  }

  async fetchSubaccount(id_or_code: string) {
    return await this.paystackService.fetchSubaccount(id_or_code);
  }

}
