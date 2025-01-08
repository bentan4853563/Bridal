import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for a customer
interface Customer {
  _id: string; // Assuming _id is a string, adjust as necessary for your case
  // Add other customer properties as needed
}

// Initialize the state with an empty array of customers
interface CustomerState {
  customers: Customer[];
}

const initialState: CustomerState = {
  customers: [],
};

// Create a slice for customers with actions to manipulate the data
const customerSlice = createSlice({
  name: "customer", // The name used in action types
  initialState, // The initial state for the slice
  reducers: {
    // Action to set the entire array of customers. Payload should be an array of Customer objects.
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    // Action to update an individual customer within the array.
    // The payload should be a Customer object representing the updated customer.
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers = state.customers?.map((customer) =>
        // Check if the current customer matches the one being updated via _id
        customer._id === action.payload._id ? action.payload : customer
      );
    },
    // Action to delete a customer. The payload should be the customer's _id.
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers?.filter(
        (customer) => customer._id !== action.payload
      );
    },
  },
});

// Export the action creators for use in dispatching actions to the store
export const { setCustomers, updateCustomer, deleteCustomer } =
  customerSlice.actions;

// Export the reducer for inclusion in the Redux store
export default customerSlice.reducer;
