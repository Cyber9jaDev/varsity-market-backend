import { BadRequestException, Injectable } from '@nestjs/common';
import { SubaccountResponse } from '../interface/payment.interface';
import axios from 'axios';

@Injectable()
export class PaystackService {
  
  async createSubaccount(): Promise<SubaccountResponse> {
    try {
      const { data } = await axios.post(
        'https://api.paystack.co/subaccount',
        {
          business_name: 'Varsity Leave me alone',
          bank_code: "044", 
          account_number: '0123456789',
          percentage_charge: 2.5,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
