import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddItemToCartDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  productInCartId: string
}