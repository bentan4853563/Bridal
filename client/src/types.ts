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
  category: string;
  subCategory: string;
  quantity: number
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

export interface OrderDetail {
  // Define properties for each detail in the details array
  _id: string;
  product: Product;
  amount: number;
}

export interface Order {
  _id: string; // Unique identifier for the order
  customer: Customer; // Using the Customer interface
  details: OrderDetail[]; // Array of order details
  reserveDate: string; // ISO 8601 format date string
  returnDate: string; // ISO 8601 format date string
  paymentState: boolean; // True if paid, false otherwise
  status: string
}

export interface Payment {
  _id: string; 
  customer: Customer; 
  order: Order[]; 
  paymentStatus: string; 
  date: Date; 
}

export interface Category {
  _id: string;
  name: string;
  subCategories: string[];
}
