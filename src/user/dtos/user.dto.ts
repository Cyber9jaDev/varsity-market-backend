import { ApiProperty } from '@nestjs/swagger';
import {
  // IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ type: String, example: 'Seller 1', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Phone must be a valid phone number',
    type: String,
    example: '1000000001',
    required: false,
  })
  @IsOptional()
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Phone must be a valid phone number',
  })
  phone?: string;

  @ApiProperty({
    type: String,
    example: 'Evelyn Gold Pre-order',
    required: false,
  })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    type: String,
    example: '0138427910',
    required: false,
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  accountNumber?: string;

  @ApiProperty({
    type: String,
    example: '058',
    description:
      'Use the /payment/banks endpoint to get a list of all bank codes',
    required: false,
  })
  @IsString()
  @IsOptional()
  bankCode?: string;
}
