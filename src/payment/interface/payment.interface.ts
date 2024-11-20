export interface BankResponseOk {
  status: false;
  message: string;
  data: Banks[];
}

interface Banks {
  name: string,
  slug: string,
  code: string,
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

export interface SubaccountResponse {
  "status": boolean,
  "message": string,
  "data": {
      "business_name": string,
      "account_number": string, 
      "percentage_charge": number,
      "settlement_bank": string,
      "currency": string,
      "bank": number,
      "integration": number,
      "domain": string,
      "account_name": string,
      "product": string,
      "managed_by_integration": number,
      "subaccount_code": string,
      "is_verified": boolean,
      "settlement_schedule": string,
      "active": boolean,
      "migrate": boolean,
      "id": number,
      "createdAt": string,
      "updatedAt": string
  }
}
  
