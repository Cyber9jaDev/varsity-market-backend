import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubaccount, SubaccountResponse } from '../interface/payment.interface';
import APICall from 'src/helpers/APICall';

@Injectable()
export class PaystackService {
  async createSubaccount(body: CreateSubaccount): Promise<SubaccountResponse> {
    try {
      const data = APICall<SubaccountResponse>("/subaccount", "POST", body)
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
