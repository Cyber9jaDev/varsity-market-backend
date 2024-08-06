import { CategoryType, ConditionType, Location } from '@prisma/client';

export enum OrderByEnum {
  asc = 'asc',
  desc = 'desc',
}

export interface OrderBy {
  price?: OrderByEnum
}

export interface Filter {
  searchText?: string,
  category?: CategoryType,
  location?: Location,
  dateFrom?: Date,
  dateTo?: Date,
  page?: number,
  limit?: number,
  price?: { 
    gte?: number, 
    lte?: number,
  }
}

export interface createProductParams {
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  condition: ConditionType;
  location: Location;
}

export interface ProductImageParams {
  secure_url: string;
  asset_id: string;
  public_id: string;
}

export interface UpdateProductInterface {
  name?: string;
  description?: string;
  price?: number;
  category?: CategoryType;
  condition?: ConditionType;
  location?: Location;
}
