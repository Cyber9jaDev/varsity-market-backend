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
