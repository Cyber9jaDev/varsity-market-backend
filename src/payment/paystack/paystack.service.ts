import { BadRequestException, Injectable } from '@nestjs/common';
import { SubaccountResponse } from '../interface/payment.interface';
import APICall from 'src/helpers/APICall';

const body = {
  business_name: 'Varsity Leave me alone',
  settlement_bank: '044',
  account_number: '0123456789',
  percentage_charge: 10,
};

@Injectable()
export class PaystackService {
  async createSubaccount(): Promise<SubaccountResponse> {
    try {
      const data = await APICall<SubaccountResponse>(
        '/subaccount',
        'POST',
        body,
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
