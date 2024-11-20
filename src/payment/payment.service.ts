import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import { CreateSubaccount, SubaccountResponse } from './interface/payment.interface';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async getBanks() {
    const { data } = await axios.get('https://api.paystack.co/bank', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    return data
  }

  async createSubaccount(createSubaccount: CreateSubaccount): Promise<SubaccountResponse> {
    return await this.paystackService.createSubaccount()
  }

  async initialize (){
    // return await this.paystackService.initia
  }
}
