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
import CustomersLayout from './pages/main/Customers/Layout'
import CustomerInformation from "./pages/main/Customers/CustomerInformation";
import CustomerList from './pages/main/Customers/CustomerList'
import CreateCustomer from "./pages/main/Customers/CreateCustomer";

import InventoryLayout from "./pages/main/Inventory/Layout";
import BundleList from "./pages/main/Inventory/BundleList";
import ProductList from "./pages/main/Inventory/ProductList";
import CollectionList from "./pages/main/Inventory/CollectionList";
import ProductLayout from "./pages/main/Product/Layout";
import Inventory from "./pages/main/Product/Inventory";
import Setting from "./pages/main/Product/Setting";
import Pricing from "./pages/main/Product/Pricing";
import Dashbaord from "./pages/main/Dashboard/Layout";
import CardsOnFile from "./pages/main/Customers/CardsOnFile";
import Orders from "./pages/main/Customers/Orders";
import CustomerLayout from "./pages/main/Customers/CustomerLayout";
import OrdersLayout from "./pages/main/Orders/Layout";
import CreateProduct from "./pages/main/Product/NewProduct";
import History from "./pages/main/Product/History";

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
            <Route path="dashboard" element={<Dashbaord />} />

            <Route path="customers" element={<CustomersLayout />}>
              <Route path="" element={<CustomerList />} />
              <Route path="new" element={<CreateCustomer />} />
              <Route path=":id" element={<CustomerLayout />}>
                <Route path="information" element={<CustomerInformation />} />
                <Route path="orders" element={<Orders />} />
                <Route path="cardsonfile" element={<CardsOnFile />} />
              </Route>
            </Route>

            <Route path="inventory" element={<InventoryLayout />}>
              <Route path="products" element={<ProductList />} />
              <Route path="bundles" element={<BundleList />} />
              <Route path="collections" element={<CollectionList />} />
            </Route>

            <Route path="products/:id" element={<ProductLayout />}>
              <Route path="inventory" element={<Inventory />} />
              <Route path="setting" element={<Setting />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="history" element={<History />} />
            </Route>

            <Route path="product/new" element={<CreateProduct />} />

            <Route path="orders" element={<OrdersLayout />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;
