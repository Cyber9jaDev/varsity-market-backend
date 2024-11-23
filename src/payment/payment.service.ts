import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import {
  CreateSubaccount,
  SubaccountResponse,
} from './interface/payment.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async getBanks() {
    return await this.paystackService.bankList();
  }

  async verifySellerBankAccount(account_number: string, bank_code: string) {
    return await this.paystackService.verifyAccountNumber(
      account_number,
      bank_code,
    );
  }

  async createSubaccount(
    createSubaccount: CreateSubaccount,
  ): Promise<SubaccountResponse> {
    return await this.paystackService.createSubaccount(createSubaccount);
  }
}
