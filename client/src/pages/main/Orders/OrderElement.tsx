import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";

import { Button, Chip } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import { Customer, Order, Product } from "../../../types";

import { IoSaveOutline } from "react-icons/io5";
import { IoLockClosedOutline } from "react-icons/io5";
import { TfiBackRight } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";

import { getColorFromLetter } from "../../../utils/getColorFromLetter";
import { handleGetOrderById, handleReserve } from "../../../actions/order";
import { handleGetAllCustomers } from "../../../actions/customer";
import { handleGetAllProducts } from "../../../actions/product";

export default function OrderElement() {
  const params = useParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [differenceInDays, setDifferenceInDays] = useState<number | null>(null);

  const [orderDetails, setOrderDetails] = useState<
    { product: string; amount: number }[]
  >([]);

  // State to hold the start and end dates
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const customerList = await handleGetAllCustomers();
      const productList = await handleGetAllProducts();
      setCustomers(customerList);
      setProducts(productList);
      if (params.id) {
        const order: Order = await handleGetOrderById(params.id);
        if (order.customer) {
          setSelectedCustomer(order.customer);
        }
        if (order.reserveDate) {
          setStartDate(dayjs(order.reserveDate));
        }
        if (order.returnDate) {
          setEndDate(dayjs(order.returnDate));
        }
        if (order.details) {
          const products = order.details.map((order) => order.product)
          setSelectedProducts(products)
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const diffDays = endDate.diff(startDate, "day");
      setDifferenceInDays(diffDays);
    } else {
      setDifferenceInDays(null); // Reset if any date is null
    }
  }, [startDate, endDate]);

  const handleDateChange = (newValue: [Dayjs | null, Dayjs | null]) => {
    const [newStartDate, newEndDate] = newValue;
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleOnSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleOnSelectProduct = (product: Product) => {
    const isExist = selectedProducts.find(
      (item: Product) => item._id == product._id
    );

    if (!isExist) {
      setSelectedProducts([...selectedProducts, product]);
      // Add product ID to orderDetails with a default amount of 1
      setOrderDetails((prev) => [...prev, { product: product._id, amount: 1 }]);
    }
  };

  const handleChangeAmount = (product: string, amount: number) => {
    setOrderDetails((prev) => {
      const existing = prev.find((item) => item.product === product);
      if (existing) {
        return prev.map((item) =>
          item.product === product ? { ...item, amount } : item
        );
      } else {
        return [...prev, { product, amount }];
      }
    });
  };

  const formatResult = (item: Product) => {
    return (
      <div key={item._id} className="flex items-center gap-4">
        <img
          src={item.image} // Assuming primaryPhoto is the URL for the image
          alt={item.name}
          className="w-16 h-16 rounded-lg"
        />
        <span>{item.name}</span>
      </div>
    );
  };

  // Check if all required fields are filled
  const areFieldsValid = () => {
    return (
      selectedCustomer !== null &&
      startDate !== null &&
      endDate !== null &&
      selectedProducts.length > 0
    );
  };

  const reserve = () => {
    const formData = {
      customer: selectedCustomer?._id,
      details: orderDetails,
      reserveDate: startDate,
      returnDate: endDate,
      status: "Reserved",
    };

    handleReserve(formData, () => {
      toast.success("Reserved your order successfully.");
    });
  };

  const pickup = () => {
    const formData = {
      customer: selectedCustomer?._id,
      details: orderDetails,
      reserveDate: startDate,
      returnDate: endDate,
      status: "Picked up",
    };

    handleReserve(formData, () => {
      toast.success("Reserved your order successfully.");
    });
  };

  return (
    <div className="text-black h-screen flex flex-col">
      {/* Header */}
      <div className="px-12 py-6 border-b flex justify-between">
        <div className="bg-white flex items-center gap-8">
          <span className="text-2xl">Orders</span>
          <Chip label="New" />
        </div>

        <div className="flex gap-4">
          <Link to="/orders/new">
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<IoSaveOutline />}
              size="small"
              className="text-sm"
              color="inherit"
            >
              Save as draft
            </Button>
          </Link>
          {areFieldsValid() && (
            <>
              <Button
                startIcon={<IoLockClosedOutline />}
                variant="contained"
                size="small"
                color="primary"
                onClick={reserve}
              >
                Reserve
              </Button>
              <Button
                startIcon={<TfiBackRight />}
                variant="contained"
                size="small"
                color="warning"
                onClick={pickup}
              >
                Pickup
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-full overflow-y-auto bg-gray-100 p-12 flex flex-col gap-8">
        {/* Customer and Rental Period */}
        <div className="w-full flex flex-col lg:flex-row gap-8">
          {/* Customer */}
          <div className="box flex flex-col flex-1 items-start divide-y">
            <div className="w-full p-4 flex flex-col items-start">
              <h4 className="text-xl">Customer</h4>
            </div>
            <div className="w-full p-4 flex flex-col z-50">
              {selectedCustomer ? (
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center justify-start gap-4">
                    <div
                      style={{
                        backgroundColor: getColorFromLetter(
                          selectedCustomer.name[0]
                        ),
                      }}
                      className="rounded-full p-1 w-12 h-12 flex items-center justify-center"
                    >
                      {selectedCustomer.name[0]}
                    </div>
                    {selectedCustomer.name}
                  </div>
                  <IoMdClose
                    onClick={() => setSelectedCustomer(null)}
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                <ReactSearchAutocomplete
                  items={customers}
                  onSelect={handleOnSelectCustomer}
                  autoFocus
                  // Additional props as needed
                />
              )}
            </div>
          </div>

          {/* Rental Period */}
          <div className="box flex flex-col flex-1 items-start divide-y">
            <div className="w-full p-4 flex flex-col items-start">
              <h4 className="text-xl">Rental period</h4>
            </div>
            <div className="w-full p-4 flex flex-col">
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimeRangePicker"]}>
                    <DateTimeRangePicker
                      value={[startDate, endDate]} // Bind to the state
                      onChange={handleDateChange} // Update the state on change
                      localeText={{ start: "Start", end: "End" }}
                    />
                  </DemoContainer>
                </LocalizationProvider>

                <Chip label={`${differenceInDays}days`} />
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="box divide-y">
          <div className="w-full p-4 flex flex-col items-start">
            <h4 className="text-xl">Product</h4>
          </div>
          <div className="w-full p-4 flex flex-col">
            <ReactSearchAutocomplete
              items={products.map(
                (product): Product => ({
                  _id: product._id,
                  name: product.name,
                  image: product.image,
                  rentalCostPerDay: product.rentalCostPerDay,
                  primaryPhoto: product.primaryPhoto, // Ensure this exists in the product
                  quantity: product.quantity, // Ensure this exists in the product
                  category: product.category,
                  subCategory: product.subCategory,
                })
              )}
              onSelect={handleOnSelectProduct}
              formatResult={formatResult} // Use the custom formatResult function
              autoFocus
            />
          </div>

          {/* Product Table */}
          <div className="p-4">
            {selectedProducts.length > 0 && (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Rental Cost</th>
                    <th>Days</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.length > 0 &&
                    selectedProducts.map((product, index) => {
                      const amount =
                        orderDetails.find((item) => item.product == product._id)
                          ?.amount || 1; // Default to 1 if not found
                      const totalPrice =
                        product.rentalCostPerDay *
                        amount *
                        (differenceInDays || 1);

                      return (
                        <tr key={index}>
                          <td>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-lg"
                            />
                          </td>
                          <td>{product?.name}</td>
                          <td>
                            <input
                              type="number"
                              name="amount"
                              className="border rounded-lg p-2"
                              min={1}
                              value={amount}
                              onChange={(e) =>
                                handleChangeAmount(
                                  product._id,
                                  Number(e.target.value)
                                )
                              }
                            />
                          </td>
                          <td>{product.rentalCostPerDay}</td>
                          <td>{differenceInDays}</td>
                          <td>{totalPrice}</td>
                          <td>
                            <IoMdClose
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedProducts(
                                  selectedProducts.filter(
                                    (p) => p._id !== product._id
                                  )
                                );
                                // Remove product ID from orderDetails
                                setOrderDetails(
                                  orderDetails.filter(
                                    (item) => item.product !== product._id
                                  )
                                );
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
