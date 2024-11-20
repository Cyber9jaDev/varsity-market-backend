import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class initializePaymentDto {
  @ApiProperty({
    type: 'string',
    example: '2532cadc-7b3c-420b-9f8b-c3cdbec73e69',
  })
  @IsNotEmpty()
  @IsString()
  sellerId: string;

  @ApiProperty({
    type: 'string',
    example: 'a29671da-9922-4a38-b506-841a5d03d9a1',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({
    type: 'number',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // business_name: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // bank_code: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // account_number: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsNumber()
  // percentage_charge: number;
}
