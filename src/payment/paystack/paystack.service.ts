import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateSubaccount,
  SubaccountResponse,
  VerifyAccountResponse,
} from '../interface/payment.interface';
import APICall from 'src/helpers/APICall';

@Injectable()
export class PaystackService {
  async bankList() {
    try {
      const data = await APICall<unknown>(
        '/bank',
        'GET',
        {},
        {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createSubaccount(body: CreateSubaccount): Promise<SubaccountResponse> {
    try {
      const data = APICall<SubaccountResponse>('/subaccount', 'POST', body, {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyAccountNumber(account_number: string, bank_code: string) {
    const num = '0138427910';
    const code = '058';
    try {
      const data = APICall<VerifyAccountResponse>(
        `/bank/resolve?account_number=${num}&bank_code=${code}`,
        // `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        'POST',
        {},
        { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
