export interface Product {
  sku: string;
  name: string;
  brand: string;
  unit_amount: number;
  product_type_id: string;
  image_url?: string;
  product_url?: string;
  product_type_name?: string;
  unit_multiplier_un?: number;
}

export interface CreateProductData {
  sku: string;
  name: string;
  brand: string;
  unit_amount: number;
  product_type_id: string;
  image_url?: string;
  product_url?: string;
}

export interface UpdateProductData {
  name?: string;
  brand?: string;
  unit_amount?: number;
  product_type_id?: string;
  image_url?: string;
  product_url?: string;
}
