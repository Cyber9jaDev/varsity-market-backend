import { ApiProperty } from '@nestjs/swagger';
import { CategoryType, ConditionType, Location } from '@prisma/client';
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

  // @IsNotEmpty()
  // @IsString()
  // asset_id: string;

  // @IsNotEmpty()
  // @IsString()
  // public_id: string;
}

export class CreateProductDto {
  @ApiProperty({
    type: 'string',
    example: 'Samsung Galaxy 12 Notebook',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'Samsung Galaxy 12 Notebook',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: Location, example: Location.OAU, required: true })
  @IsNotEmpty()
  @IsEnum(Location)
  location: Location;

  @ApiProperty({ type: 'number', example: 120000, required: true })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    enum: ConditionType,
    example: ConditionType.USED,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ConditionType)
  condition: ConditionType;

  @ApiProperty({
    enum: CategoryType,
    example: CategoryType.BOOK,
    required: true,
  })
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
  images: ImageDto[]

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
