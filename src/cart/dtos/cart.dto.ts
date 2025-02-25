import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}

export class RemoveItemFromCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
