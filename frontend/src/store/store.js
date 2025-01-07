// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./reducers/customerSlice";
import itemReducer from "./reducers/itemSlice";
import categoryReducer from "./reducers/categorySlice";
import reservationReducer from "./reducers/reservationSlice";
import paymentReducer from "./reducers/paymentSlice";

const store = configureStore({
  reducer: {
    customer: customerReducer,
    item: itemReducer,
    category: categoryReducer,
    reservation: reservationReducer,
    payment: paymentReducer,
  },
});

// Export the store
export default store;
