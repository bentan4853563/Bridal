export interface ApiError {
  response?: {
    data: {
      errors: Array<{ detail: string }>;
    };
  };
}


export interface ProductData {
  name: string;
  primaryPhoto: File | string;
  rentalCostPerDay: number;
  quantity: number;
  status: string;
}