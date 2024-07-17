import { CategoryType, ConditionType } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";


export class Image {
  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[]
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

  constructor(partial: Partial<ProductResponseDto>){
    Object.assign(this, partial)
  }
}