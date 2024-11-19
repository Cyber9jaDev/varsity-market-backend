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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  secure_url: string;
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

  @ApiProperty({ type: 'number', example: 1, required: true, default: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Image)
  // images: Image[]
}

export class UpdateProductDto {
  @ApiProperty({
    type: 'string',
    example: 'Samsung Galaxy 12 Notebook',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'string',
    example: 'Samsung Galaxy 12 Notebook',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Location, example: Location.OAU, required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Location)
  location?: Location;

  @ApiProperty({ type: 'number', example: 120000, required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price?: number;

  @ApiProperty({
    enum: ConditionType,
    example: ConditionType.USED,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ConditionType)
  condition?: ConditionType;

  @ApiProperty({
    enum: CategoryType,
    example: CategoryType.BOOK,
    required: false,
  })
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
  @ApiProperty({ example: '58b7f14f-dcdd-4957-867e-0cf7f88b00fb' })
  id: string;
  @ApiProperty({ example: 'testing Microphone' })
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  location: Location;
  @ApiProperty()
  price: number;
  @ApiProperty()
  condition: ConditionType;
  @ApiProperty()
  images: ImageDto[];

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
