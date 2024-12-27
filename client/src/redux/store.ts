// Import the configureStore utility from Redux Toolkit and individual reducers.
import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./reducers/customerSlice"; // Reducer for customer-related state
import orderReducer from "./reducers/orderSlice"; // Reducer for order-related state


// Configure the Redux store
const store = configureStore({
  reducer: {
    customer: customerReducer, // Connects customerReducer to the 'customer' state slice
    order: orderReducer, // Connects orderReducer to the 'order' state slice
  },
});

// Export the configured Redux store
export default store;
