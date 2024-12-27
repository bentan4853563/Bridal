import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for a customer
interface Order {
  _id: string; // Assuming _id is a string, adjust as necessary for your case
}

// Initialize the state with an empty array of customers
interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

// Create a slice for orders with actions to manipulate the data
const orderSlice = createSlice({
  name: "order", // The name used in action types
  initialState, // The initial state for the slice
  reducers: {
    // Action to set the entire array of customers. Payload should be an array of Customer objects.
    setOrders: (state, action: PayloadAction<Order[]>) => {
      console.log('action.payload :>> ', action.payload);
      state.orders = action.payload;
    },
    // Action to update an individual customer within the array.
    // The payload should be a Customer object representing the updated order.
    updateCustomer: (state, action: PayloadAction<Order>) => {
      state.orders = state.orders.map((order) =>
        // Check if the current customer matches the one being updated via _id
        order._id === action.payload._id ? action.payload : order
      );
    },
    // Action to delete a order. The payload should be the customer's _id.
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );
    },
  },
});

// Export the action creators for use in dispatching actions to the store
export const { setOrders, updateCustomer, deleteCustomer } =
  orderSlice.actions;

// Export the reducer for inclusion in the Redux store
export default orderSlice.reducer;
