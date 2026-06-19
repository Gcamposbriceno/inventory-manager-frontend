export type MeasurementUnit = 'kg' | 'l' | 'ml' | 'g' | 'un';

export interface ProductType {
  id: string;
  name: string;
  measurement_unit: MeasurementUnit;
  is_quick_fill?: boolean;
}

export interface CreateProductTypeData {
  name: string;
  measurement_unit: MeasurementUnit;
}

export interface UpdateProductTypeData {
  name?: string;
  measurement_unit?: MeasurementUnit;
}