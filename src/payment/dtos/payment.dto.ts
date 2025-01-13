import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class TransactionInitializationDto {
  @ApiProperty({
    type: 'string',
    example: 'a29671da-9922-4a38-b506-841a5d03d9a1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ type: 'number', example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    type: 'string',
    example: 'http://localhost:3000/verify-payment',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  callback_url: string;

  @ApiProperty({
    type: 'object',
    properties: { productName: { type: 'string', example: 'Error' } },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string | number | object>;
}

export class VerifyPaymentDto {
  @ApiProperty({
    name: 'reference',
    type: 'string',
    example: 'TX-1733484067905-dtfisbbte',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  reference: string;
}

export class UpdateSubaccountDto {
  @ApiProperty({ required: true, example: 'Business Name' })
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @ApiProperty({ required: true, example: 'Business Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false, example: '058' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  bank_code?: string;

  @ApiProperty({ required: false, example: '0138427910' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  account_number?: string;

  @ApiProperty({ required: false, example: '0138427910' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  primary_contact_email?: string;

  @ApiProperty({ required: false, example: 'Caroline Gomez' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  primary_contact_name?: string;

  @ApiProperty({ required: false, example: '8062128171' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  primary_contact_phone?: string;

  @ApiProperty({ required: false, example: { key: 'value' } })
  @IsOptional()
  metadata?: Record<string, string | number>;
}
