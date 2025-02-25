import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import {
  CreateSubaccountResponse,
  UpdateSubaccountParams,
  VerifyPayment,
} from './interface/payment.interface';
import { User } from '@prisma/client';
import { AuthParams } from 'src/user/interface/user.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paystackService: PaystackService,
    private readonly databaseService: DatabaseService,
  ) {}

  async verifyTransaction(reference: string): Promise<VerifyPayment> {
    return await this.paystackService.verifyTransaction(reference);
  }

  async getBanks() {
    return await this.paystackService.bankList();
  }

  async initializeTransaction(
    buyerEmail: string,
    quantity: number,
    amount: number,
    subaccount: string,
    reference: string,
    callback_url: string,
  ) {
    return await this.paystackService.initializeTransaction(
      buyerEmail,
      quantity,
      amount,
      subaccount,
      reference,
      callback_url,
    );
  }

  // async verifySellerBankAccount({ accountNumber, bankCode }: AuthParams) {
  async verifySellerBankAccount({
    accountNumber,
    bankCode,
  }: Partial<AuthParams>) {
    return await this.paystackService.verifyAccountNumber(
      accountNumber,
      bankCode,
    );
  }

  async createSubaccount(
    seller: Partial<User>,
  ): Promise<CreateSubaccountResponse> {
    return await this.paystackService.createSubaccount(seller);
  }

  async fetchSubaccount(id_or_code: string) {
    return await this.paystackService.fetchSubaccount(id_or_code);
  }

  async updateSubaccount(id_or_code: string, body: UpdateSubaccountParams) {
    return await this.paystackService.updateSubaccount(id_or_code, body);
  }
}
