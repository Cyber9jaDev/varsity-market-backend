import { Injectable } from '@nestjs/common';
import { initializePaymentDto } from './dtos/payment.dto';

@Injectable()
export class PaymentService {
  async initializePayment(){
    return []
  }
}
