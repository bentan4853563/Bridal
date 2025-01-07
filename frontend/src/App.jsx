import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";
import CustomerView from "./pages/CustomerView";
import AddPayment from "./pages/AddPayment";
import EditPayment from "./pages/EditPayment";
import PaymentView from "./pages/PaymentView";
import Reservations from "./pages/Reservations";
import Items from "./pages/Items";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";

import { setCustomers } from "./store/reducers/customerSlice";
import { setCategories } from "./store/reducers/categorySlice";
import { handleGetCustomers } from "./actions/customer";
import { handleGetCategories } from "./actions/category";
import { handleGetAllProducts } from "./actions/product";
import { setItems } from "./store/reducers/itemSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCustomers = async () => {
      const items = await handleGetAllProducts();
      const customers = await handleGetCustomers();
      const categories = await handleGetCategories();
      dispatch(setCustomers(customers));
      dispatch(setCategories(categories));
      dispatch(setItems(items));
    };

    loadCustomers();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Redirect /dashboard to /home */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />

        {/* Dashboard layout wrapper */}
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={null} />{" "}
          {/* Dashboard content is handled in the Dashboard component */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/items" element={<Items />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/documentation" element={<Documentation />} />
          {/* Customer routes */}
          <Route path="/customer/:id" element={<CustomerView />} />
          <Route path="/customer/:id/edit" element={<EditCustomer />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          {/* Payment routes */}
          <Route path="/payment/:id" element={<PaymentView />} />
          <Route path="/payment/:id/edit" element={<EditPayment />} />
          <Route path="/add-payment" element={<AddPayment />} />
        </Route>

        {/* Catch all route */}
        <Route
          path="*"
          element={
            localStorage.getItem("isAuthenticated") ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;