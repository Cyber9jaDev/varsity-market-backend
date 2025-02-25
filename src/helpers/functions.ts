import { UserType } from '@prisma/client';
import { AuthParams } from 'src/user/interface/user.interface';

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date.getTime());
}

export const data = (
  body: AuthParams,
  userType: UserType,
  hashedPassword: string,
  subaccountCode: string,
) => {
  return {
    email: body.email,
    phone: body.phone,
    name: body.name,
    password: hashedPassword,
    userType,
    businessName: body.businessName,
    accountNumber: body.accountNumber,
    bankCode: body.bankCode,
    subaccountCode,
  };
};
