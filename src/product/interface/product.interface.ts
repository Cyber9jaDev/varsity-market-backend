import { CategoryType, ConditionType } from "@prisma/client";

export interface createProductParams{
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  condition: ConditionType,
  location: string,
  images: { imageUrl: string }[]; 
}


export interface UpdateProductInterface{
  name?: string;
  description?: string;
  price?: number;
  category?: CategoryType;
  condition?: ConditionType,
  location?: string,
}