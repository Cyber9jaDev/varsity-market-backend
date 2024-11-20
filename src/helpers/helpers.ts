import { BadRequestException } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BankResponseOk, SubaccountResponse } from 'src/payment/interface/payment.interface';

const wordsToCheck = [
  'Access Bank',
  'Zenith Bank',
  'Union Bank',
  'Guaranty Trust Bank',
  'Kuda',
  'OPay',
  'PalmPay',
  'First Bank',
];

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

const banks = [
  {
    id: 1,
    name: 'Access Bank',
    slug: 'access-bank',
    code: '044',
    longcode: '044150149',
    gateway: 'emandate',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2016-07-14T10:04:29.000Z',
    updatedAt: '2020-02-18T08:06:44.000Z',
  },
  {
    id: 3,
    name: 'Access Bank (Diamond)',
    slug: 'access-bank-diamond',
    code: '063',
    longcode: '063150162',
    gateway: 'emandate',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2016-07-14T10:04:29.000Z',
    updatedAt: '2020-02-18T08:06:48.000Z',
  },
  {
    id: 7,
    name: 'First Bank of Nigeria',
    slug: 'first-bank-of-nigeria',
    code: '011',
    longcode: '011151003',
    gateway: 'ibank',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2016-07-14T10:04:29.000Z',
    updatedAt: '2021-03-25T14:22:52.000Z',
  },
  {
    id: 9,
    name: 'Guaranty Trust Bank',
    slug: 'guaranty-trust-bank',
    code: '058',
    longcode: '058152036',
    gateway: 'ibank',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2016-07-14T10:04:29.000Z',
    updatedAt: '2024-11-14T12:30:43.000Z',
  },
  {
    id: 67,
    name: 'Kuda Bank',
    slug: 'kuda-bank',
    code: '50211',
    longcode: '',
    gateway: 'digitalbankmandate',
    pay_with_bank: true,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2019-11-15T17:06:54.000Z',
    updatedAt: '2024-10-29T10:56:03.000Z',
  },
  {
    id: 171,
    name: 'OPay Digital Services Limited (OPay)',
    slug: 'paycom',
    code: '999992',
    longcode: '',
    gateway: 'ibank',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2020-11-24T10:20:45.000Z',
    updatedAt: '2024-10-29T10:56:03.000Z',
  },
  {
    id: 169,
    name: 'PalmPay',
    slug: 'palmpay',
    code: '999991',
    longcode: '',
    gateway: 'ibank',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2020-11-24T09:58:37.000Z',
    updatedAt: '2024-10-22T10:43:42.000Z',
  },
  {
    id: 17,
    name: 'Union Bank of Nigeria',
    slug: 'union-bank-of-nigeria',
    code: '032',
    longcode: '032080474',
    gateway: 'emandate',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2016-07-14T10:04:29.000Z',
    updatedAt: '2020-02-18T20:22:54.000Z',
  },
  {
    id: 21,
    name: 'Zenith Bank',
    slug: 'zenith-bank',
    code: '057',
    longcode: '057150013',
    gateway: 'emandate',
    pay_with_bank: false,
    supports_transfer: true,
    active: true,
    country: 'Nigeria',
    currency: 'NGN',
    type: 'nuban',
    is_deleted: false,
    createdAt: '2016-07-14T10:04:29.000Z',
    updatedAt: '2023-09-26T17:09:43.000Z',
  },
];

export const findMatchingBankName = () => {
  return banks
    .filter(
      (bank) =>
        bank.country === 'Nigeria' &&
        wordsToCheck.some((word) => bank.name.includes(word)),
    )
    .map((bank) => {
      return {
        name: bank.name,
        slug: bank.slug,
        code: bank.code,
      };
    });
};
