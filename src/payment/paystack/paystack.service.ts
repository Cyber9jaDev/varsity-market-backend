import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateSubaccount,
  CreateSubaccountResponse,
  SellerSubaccount,
  VerifyAccountNumberResponse,
} from '../interface/payment.interface';
import APICall from 'src/helpers/APICall';
import { User } from '@prisma/client';

@Injectable()
export class PaystackService {
  async bankList() {
    try {
      const response = await APICall<unknown>(
        '/bank',
        'GET',
        {},
        {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createSubaccount(seller: Partial<User>): Promise<CreateSubaccountResponse> {

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
      const response = APICall<CreateSubaccountResponse>( '/subaccount', 'POST', data, {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      );
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyAccountNumber( account_number: string, bank_code: string ): Promise<VerifyAccountNumberResponse> {
    if (!account_number || !bank_code) {
      throw new BadRequestException(
        'Account number and bank code are required',
      );
    }

    try {
      const data = await APICall<VerifyAccountNumberResponse>(
        `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        'GET',
        {},
        { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      );
      return data;
    } catch (error) {
      throw new BadRequestException('Unable to verify seller bank details');
    }
  }

  async findSubaccount(id_or_code: string) {
    try {
      const data = await APICall<VerifyAccountNumberResponse>( `/subaccount/${id_or_code}`, 'GET', {}, { 
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      );
      return data;
    } catch (error) {
      throw new BadRequestException('Unable to verify seller bank details');
    }
  }
}
