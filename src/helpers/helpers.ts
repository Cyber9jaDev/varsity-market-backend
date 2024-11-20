import { BadRequestException } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  BankResponseOk,
  SubaccountResponse,
} from 'src/payment/interface/payment.interface';


export const createSubaccount = async (): Promise<SubaccountResponse> => {
  try {
    const { data } = await axios.post(
      'https://api.paystack.co/subaccount',
      {
        business_name: 'Varsity Market',
        settlement_bank: '044',
        account_number: '0123456789',
        percentage_charge: 10,
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
};

export const getBanksList = async (): Promise<BankResponseOk> => {
  try {
    const { data }: AxiosResponse = await axios.get(
      'https://api.paystack.co/bank',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    return data;
  } catch (error) {
    throw new BadRequestException();
  }
};

export const bankList = [
  {
    "name": "Access Bank",
    "slug": "access-bank",
    "code": "044"
  },
  {
    "name": "First Bank of Nigeria",
    "slug": "first-bank-of-nigeria",
    "code": "011"
  },
  {
    "name": "Guaranty Trust Bank",
    "slug": "guaranty-trust-bank",
    "code": "058"
  },
  {
    "name": "Kuda Bank",
    "slug": "kuda-bank",
    "code": "50211"
  },
  {
    "name": "OPay Digital Services Limited (OPay)",
    "slug": "paycom",
    "code": "999992"
  },
  {
    "name": "PalmPay",
    "slug": "palmpay",
    "code": "999991"
  },
  {
    "name": "Union Bank of Nigeria",
    "slug": "union-bank-of-nigeria",
    "code": "032"
  },
  {
    "name": "Zenith Bank",
    "slug": "zenith-bank",
    "code": "057"
  }
]

export const getBankCode = (bankName: string) => {
  const matchingBank = bankList.find(bank => bank.name === bankName);
  return matchingBank.code;
};
