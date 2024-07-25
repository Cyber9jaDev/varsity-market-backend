import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddItemToCartDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  productId: string;
}

export class RemoveItemFromCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}