import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  IsEmail,
  isEnum,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ type: String, example: 'Steven David' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: 'steven.david@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password must contain an upper case, lower case, number and special character. \n It must have minimum Length of 5 characters',
    type: String,
    example: 'Test@123',
  })
  @MinLength(5)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Phone must be a valid phone number',
    type: String,
    example: '8097122170',
  })
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Phone must be a valid phone number',
  })
  phone: string;

  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  // registration_key?: string
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
