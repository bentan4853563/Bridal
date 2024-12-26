export interface ApiError {
  response?: {
    data: {
      errors: Array<{ detail: string }>;
    };
  };
}


export interface Product {
  _id: string;
  name: string;
  image: string;
  primaryPhoto: File;
  rentalCostPerDay: number;
  quantity: number;
  status: string;
}

export interface Customer {
  _id: string;
  name: string;
  surname: string;
  address: string;
  city: string;
  whatsApp: string;
  date: string;
  location: string;
  type: string;
}