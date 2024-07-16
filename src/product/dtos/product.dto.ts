import { CategoryType, ConditionType } from "@prisma/client";

export class CreateProductDto{
  name: string;
  description: string;
  location: string;
  price: number;
  condition: ConditionType;
  category: CategoryType;
  sellerId: string
}