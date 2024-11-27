import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import { CreateSubaccountResponse } from './interface/payment.interface';
import { User } from '@prisma/client';
import { AuthParams } from 'src/user/interface/user.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async getBanks() {
    return await this.paystackService.bankList();
  }

  async verifySellerBankAccount({ accountNumber, bankCode }: AuthParams) {
    return await this.paystackService.verifyAccountNumber( accountNumber, bankCode );
  }

  async createSubaccount(seller: Partial<User>): Promise<CreateSubaccountResponse> {
    return await this.paystackService.createSubaccount(seller);
  }
}
