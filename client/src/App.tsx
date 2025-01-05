import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import "./App.css";

import Loading from "./pages/loading";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import AuthLayout from "./pages/auth/Layout";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import MainPageLayout from "./pages/main/Layout";

import Payments from "./pages/main/Customers/Payments";
import CustomerInformation from "./pages/main/Customers/CustomerInformation";
import CustomerList from "./pages/main/Customers/CustomerList";
import CreateCustomer from "./pages/main/Customers/CreateCustomer";
import CustomerLayout from "./pages/main/Customers/CustomerLayout";

import InventoryLayout from "./pages/main/Inventory/Layout";
import ProductList from "./pages/main/Inventory/ProductList";

import ProductLayout from "./pages/main/Product/Layout";
import Inventory from "./pages/main/Product/Inventory";
import Setting from "./pages/main/Product/Setting";
// import Pricing from "./pages/main/Product/Pricing";
import History from "./pages/main/Product/History";

import Dashbaord from "./pages/main/Dashboard/Layout";
import Orders from "./pages/main/Customers/Orders";
import CreateProduct from "./pages/main/Product/NewProduct";

import OrdersLayout from "./pages/main/Orders/Layout"; // Update path as necessary
import OrderList from "./pages/main/Orders/OrderList";
import CreateOrder from "./pages/main/Orders/CreateOrder";
import UpcomingOrderList from "./pages/main/Orders/UpcomingOrderList";
import LateOrderList from "./pages/main/Orders/LateOrderList";
import ShortageOrderList from "./pages/main/Orders/ShortageOrderList";
import OrderElement from "./pages/main/Orders/OrderElement";
import CategorySetting from "./pages/main/Inventory/CategorySetting";
import PaymentList from "./pages/main/Payment/PaymentList";
import PaymentsLayout from "./pages/main/Payment/Layout";
import CreatePayment from "./pages/main/Payment/CreatePayment";
import EditPayment from "./pages/main/Payment/EditPayment";

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

            <Route path="customers/new" element={<CreateCustomer />} />

            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerLayout />}>
              <Route path="information" element={<CustomerInformation />} />
              <Route path="orders" element={<Orders />} />
              <Route path="payments" element={<Payments />} />
            </Route>

            <Route path="inventory" element={<InventoryLayout />}>
              <Route path="products" element={<ProductList />} />
              <Route path="setting" element={<CategorySetting />} />
            </Route>

            <Route path="products/:id" element={<ProductLayout />}>
              <Route path="inventory" element={<Inventory />} />
              <Route path="setting" element={<Setting />} />
              <Route path="history" element={<History />} />
            </Route>

            <Route path="product/new" element={<CreateProduct />} />

            <Route path="orders" element={<OrdersLayout />}>
              <Route path="" element={<OrderList />} />
              <Route path="upcoming" element={<UpcomingOrderList />} />{" "}
              <Route path="late" element={<LateOrderList />} />{" "}
              <Route path="shortage" element={<ShortageOrderList />} />{" "}
            </Route>

            <Route path="orders/:id" element={<OrderElement />} />

            <Route path="orders/new" element={<CreateOrder />} />

            <Route path="payments" element={<PaymentsLayout />}>
              <Route path="" element={<PaymentList />} />
              <Route path="new" element={<CreatePayment />} />
              <Route path="edit/:id" element={<EditPayment />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;
