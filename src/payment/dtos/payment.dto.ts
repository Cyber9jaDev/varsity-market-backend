import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class initializePaymentDto{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  business_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_code: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  percentage_charge: number;
}