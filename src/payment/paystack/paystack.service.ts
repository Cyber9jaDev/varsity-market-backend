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
      const data = await APICall<unknown>('/bank', 'GET', {});
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createSubaccount(body: CreateSubaccount): Promise<SubaccountResponse> {
    try {
      const data = APICall<SubaccountResponse>('/subaccount', 'POST', body);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyAccountNumber(accountNumber: string, bankCode: string) {
    try {
      const data = APICall<VerifyAccountResponse>(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        'POST',
        { accountNumber, bankCode },
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
