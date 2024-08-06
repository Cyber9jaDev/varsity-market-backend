import { CategoryType, ConditionType, Location } from '@prisma/client';

export interface FilterQueries {
  searchText?: string,
  category?: CategoryType,
  location?: Location,
  dateFrom?: Date,
  dateTo?: Date,
  sortBy?: string,
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
