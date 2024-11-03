import { ApiProperty } from '@nestjs/swagger';
import { CategoryType, ConditionType, Location } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ImageDto {
  @IsNotEmpty()
  @IsString()
  secure_url: string;

  @IsNotEmpty()
  @IsString()
  asset_id: string;

  @IsNotEmpty()
  @IsString()
  public_id: string;
}

export class CreateProductDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(Location)
  location: Location;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsEnum(ConditionType)
  condition: ConditionType;

  @IsNotEmpty()
  @IsEnum(CategoryType)
  category: CategoryType;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Image)
  // images: Image[]
}

export class UpdateProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Location)
  location?: Location;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ConditionType)
  condition?: ConditionType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(CategoryType)
  category?: CategoryType;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Image)
  // images?: Image[]
}

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  location: Location;
  price: number;
  condition: ConditionType;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
