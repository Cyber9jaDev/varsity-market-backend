import { CategoryType, ConditionType, Location } from "@prisma/client";

export interface createProductParams{
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  condition: ConditionType,
  location: Location,
}

export interface ProductImageParams{
  secure_url: string,  
  asset_id: string, 
  public_id: string 
}

export interface UpdateProductInterface{
  name?: string;
  description?: string;
  price?: number;
  category?: CategoryType;
  condition?: ConditionType,
  location?: Location,
}