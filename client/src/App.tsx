import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Loading from "./pages/loading";

import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import AuthLayout from './pages/auth/Layout'
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";

import MainPageLayout from "./pages/main/Layout";

import "./App.css";
import InventoryLayout from "./pages/main/Inventory/Layout";
import CustomersLayout from './pages/main/Customers/CutomersLayout'
import EditCustomer from './pages/main/Customers/EditCustomer'
import CustomerList from './pages/main/Customers/CustomerList'
import CreateCustomer from "./pages/main/Customers/CreateCustomer";
import Dashbaord from "./pages/main/Dashboard/Layout";
import OrdersLayout from "./pages/main/Orders/Layout";

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          <Route path="/" element={<MainPageLayout />}>
            <Route path="customers" element={<CustomersLayout />}>
              <Route path="" element={<CustomerList />} />
              <Route path="new" element={<CreateCustomer />} />
              <Route path="edit/:id" element={<EditCustomer />} />
            </Route>
            <Route path="inventory" element={<InventoryLayout />} />
            <Route path="orders" element={<OrdersLayout />} />
            <Route path="dashboard" element={<Dashbaord />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;
