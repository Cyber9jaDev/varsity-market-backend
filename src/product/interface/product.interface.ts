import { CategoryType, ConditionType, Location } from "@prisma/client";

export interface createProductParams{
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  condition: ConditionType,
  location: Location,
  images: { imageUrl: string }[]; 
}

export interface UpdateProductInterface{
  name?: string;
  description?: string;
  price?: number;
  category?: CategoryType;
  condition?: ConditionType,
  location?: Location,
}