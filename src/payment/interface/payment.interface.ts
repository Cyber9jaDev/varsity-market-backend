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
