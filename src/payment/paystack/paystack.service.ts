import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateSubaccount,
  SubaccountResponse,
  VerifyAccountResponse,
} from '../interface/payment.interface';
import APICall from 'src/helpers/APICall';
import { User } from '@prisma/client';

@Injectable()
export class PaystackService {
  async bankList() {
    try {
      const data = await APICall<unknown>( '/bank', 'GET', {}, { 
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` 
      },
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createSubaccount(
    seller: Omit<User, 'password'>,
  ): Promise<SubaccountResponse> {
    const data: CreateSubaccount = {
      business_name: seller.businessName,
      bank_code: seller.bankCode,
      account_number: seller.accountNumber,
      percentage_charge: 2.5,
      primary_contact_email: seller.email,
      primary_contact_name: seller.name,
      primary_contact_phone: seller.phone,
    };
    try {
      const response = APICall<SubaccountResponse>(
        '/subaccount',
        'POST',
        data,
        {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyAccountNumber(
    account_number: string,
    bank_code: string,
  ): Promise<Boolean> {
    if (!account_number || !bank_code) {
      throw new BadRequestException(
        'Account number and bank code are required',
      );
    }

    try {
      const data = await APICall<VerifyAccountResponse>(
        `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        'GET',
        {},
        { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      );
      return data.status;
    } catch (error) {
      throw new BadRequestException('Unable to verify seller bank details');
    }
  }
}
