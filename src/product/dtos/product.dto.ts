import { CategoryType, ConditionType } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsEnum(ConditionType)
  condition: ConditionType;

  @IsNotEmpty()
  @IsEnum(CategoryType)
  category: CategoryType;

  @IsNotEmpty()
  @IsString()
  sellerId: string;
}

export class ProductResponseDto {
  productId: string;
  name: string;
  description: string;
  location: string;
  price: number;
  condition: ConditionType;
  category: CategoryType;
  sellerId: string;

  @Exclude()  updatedAt: Date
  @Exclude()  createdAt: Date
  @Exclude()  productInCartId: string
}