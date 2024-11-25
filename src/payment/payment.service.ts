import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import { CreateSubaccountResponse, SellerSubaccount } from './interface/payment.interface';
import { User } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async getBanks() {
    return await this.paystackService.bankList();
  }

  async verifySellerBankAccount({accountNumber, bankCode}: Pick<User, 'accountNumber' | 'bankCode'>) {
    return await this.paystackService.verifyAccountNumber( accountNumber, bankCode );
  }

  async createSubaccount(seller: Partial<User>): Promise<CreateSubaccountResponse> {
    return await this.paystackService.createSubaccount(seller);
  }
}
