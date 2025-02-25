export interface AddItemToCartParams {
  quantity: number;
  productId: string;
}

export interface RemoveItemFromCartParams {
  productId: string;
}
