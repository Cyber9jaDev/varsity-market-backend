import { Injectable } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import { SubaccountResponse } from './interface/payment.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paystackService: PaystackService) {}

  async createSubaccount(): Promise<SubaccountResponse> {
    return await this.paystackService.createSubaccount()
  }
}
