import { UserType } from '@prisma/client';

// User from JWT
export interface UserEntity {
  userId: string;
  name: string;
  iat: number;
  exp: number;
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

export class AuthResponse {
  id: string;
  email: string;
  name: string;
  phone: string;
  userType: UserType;
  token: string;
}

export interface PictureData {
  public_id: string;
  asset_id: string;
  secure_url: string;
}

export interface UpdateUserParams {
  name?: string;
  phone?: string;
  businessName?: string;
  bankCode?: string;
  accountNumber?: string;
}
export const selectOptions = {
  id: true,
  email: true,
  name: true,
  phone: true,
  userType: true,
  hasDisplayPicture: true,
  displayPicture: { select: { secure_url: true } },
  businessName: true,
  bankCode: true,
  accountNumber: true,
};
