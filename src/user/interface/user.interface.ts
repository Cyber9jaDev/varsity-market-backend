
// User from JWT
export interface UserEntity {
  userId: string,
  name: string,
  iat: number,
  exp: number
}

export interface AuthParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName?: string;
  bankCode?: string;
  accountNumber?: string;
}
