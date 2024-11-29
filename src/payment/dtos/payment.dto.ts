import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitializePaystackTransactionDto {
  @ApiProperty({ type: 'string', example: 'a29671da-9922-4a38-b506-841a5d03d9a1', required: true })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ type: 'number', example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  // @ApiProperty({ type: 'string', example: '200' })
  // @IsNotEmpty()
  // @IsString()
  // amount: string;

  // @ApiProperty({ type: 'string', example: 'buyer1@gmail.com'})
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;
}

