import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import { CreateSubaccount, SubaccountResponse } from './interface/payment.interface';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async getBanks() {
    return await this.paystackService.bankList()
  }

  async verifySellerBankAccount (accountNumber: string, bankCode: string){
    return await this.paystackService.verifyAccountNumber(accountNumber, bankCode)
  }

  async createSubaccount(createSubaccount: CreateSubaccount): Promise<SubaccountResponse> {
    return await this.paystackService.createSubaccount(createSubaccount)
  }

  async initialize (){
    // return await this.paystackService.initia
  }
}
