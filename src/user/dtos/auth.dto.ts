import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ type: String, example: 'Seller 1', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: 'seller1@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password must contain an upper case, lower case, number and special character. \n It must have minimum Length of 5 characters',
    type: String,
    example: 'Test@123',
    required: true,
  })
  @MinLength(5)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Phone must be a valid phone number',
    type: String,
    example: '8097122170',
    required: true,
  })
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Phone must be a valid phone number',
  })
  phone: string;

  @ApiProperty({
    type: String,
    example: 'Evelyn Gold Pre-order',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    type: String,
    example: '0122022262',
    required: false,
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  accountNumber?: string;

  @ApiProperty({
    type: String,
    example: 'Guaranty Trust Bank',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bankName?: string;
}

export class SignInDto {
  @ApiProperty({
    description: 'Email must be a valid email address',
    type: String,
    example: 'steven.david@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Test@123', type: String })
  @IsString()
  password: string;
}

export class RegistrationKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}

export class AuthResponseDto {
  @ApiProperty({})
  id: string;
  @ApiProperty({})
  email: string;
  @ApiProperty({})
  name: string;
  @ApiProperty({})
  phone: string;
  @ApiProperty({})
  userType: UserType;
  @ApiProperty({})
  token: string;
}
