
export interface BankResponseOk {
  status: false;
  message: string;
  data: Banks[];
}

interface Banks {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface InitializeTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  }
}

export interface CreateSubaccountResponse {
  status: boolean;
  message: string;
  data: {
    business_name: string;
    account_number: string;
    percentage_charge: number;
    settlement_bank: string;
    bank: number;
    account_name: string;
    product: string;
    subaccount_code: string;
    id: number;
  };
}

// export interface CreateSubaccount{
//   business_name: string;
//   bank_code: string;
//   account_number: string;
//   percentage_charge: number;
//   primary_contact_email: string;
//   primary_contact_name: string;
//   primary_contact_phone: string;
// }

export type CreateSubaccount = Record<string, string | number>

export interface VerifyAccountNumberResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string,
    account_name: string
  }
}

export interface VerifyPayment {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    "paid-at": string
  }
}

export type PaystackMetadata = Record<string, string | number | object>

export type PaystackPayment = { email: string, metadata: PaystackMetadata }
