import { UserType } from "@prisma/client";
import { IsEmail, isEnum, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

// enum UserType {
//   BUYER = "BUYER",
//   SELLER = "SELLER",
//   ADMIN = "ADMIN"
// }

export class SignUpDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
  
  @MinLength(5)
  @IsString()
  password: string;

  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "Phone must be a valid phone number" })
  phone: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  registration_key?: string
}

export class SignInDto{
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;
}

export class RegistrationKeyDto{
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}