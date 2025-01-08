import { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { IoMdClose } from "react-icons/io";
import { Customer, Order } from "../../../types";
import { getColorFromLetter } from "../../../utils/getColorFromLetter";
import { handleGetAllCustomers } from "../../../actions/customer";
import { handleGetOrdersByCustomer } from "../../../actions/order";
import { handleCreatePayment } from "../../../actions/payment";

export default function CreatePayment() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [associatedOrders, setAssociatedOrders] = useState<Order[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New fields
  const [amount, setAmount] = useState<number | string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [modality, setModality] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [comments, setComments] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const customerList = await handleGetAllCustomers();
      setCustomers(customerList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCustomer?._id) {
        const orderList = await handleGetOrdersByCustomer(selectedCustomer._id);
        setAssociatedOrders(orderList);
      }
    };
    fetchData();
  }, [selectedCustomer?._id]);

  const handleOnSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSelectedOrder(null); // Reset selected order when customer changes
  };

  const handleOnSelectOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    const order = associatedOrders.find((order) => order._id === orderId);
    setSelectedOrder(order || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct payment data
    const paymentData = {
      customer: selectedCustomer?._id,
      order: selectedOrder?._id,
      amount,
      paymentType,
      modality,
      date,
      attachments,
      comments,
    };

    handleCreatePayment(paymentData, (newPaymentData) => {
      console.log('newPaymentData :>> ', newPaymentData);
    })
  };

  return (
    <div className="text-black h-screen flex flex-col overflow-y-auto">
      <div className="bg-white px-4 py-6 border-b flex justify-between items-center">
        <span className="text-2xl">Payments / New</span>
      </div>

      <div className="h-full bg-gray-100 p-4 flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
          {/* Customer Selection */}
          <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
            <div className="flex-1">
              <label>Customer</label>
              <div className="w-full">
                {selectedCustomer ? (
                  <div className=" bg-white border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        style={{
                          backgroundColor: getColorFromLetter(
                            selectedCustomer.name[0]
                          ),
                        }}
                        className="rounded-full p-1 w-6 h-6 flex items-center justify-center"
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
                    showItemsOnFocus={true}
                    autoFocus 
                    className="w-full"
                  />
                )}
              </div>
            </div>

            <div className="flex-1">
              <label>Reservation</label>
              <div className="w-full">
                {selectedOrder ? (
                  <div className=" bg-white border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {selectedOrder.details
                          .map((item) => (
                            <span key={item.product._id}>
                              {item.product.name}: {item.amount}
                            </span>
                          ))
                          .reduce((prev, curr) => (
                            <>
                              {prev}, {curr}
                            </>
                          ))}
                      </div>
                    </div>
                    <IoMdClose
                      onClick={() => setSelectedOrder(null)}
                      className="cursor-pointer"
                    />
                  </div>
                ) : (
                  <select
                    name="orders"
                    id="orders"
                    className="border p-3 rounded-md w-full"
                    onChange={handleOnSelectOrder}
                    value={selectedOrder ? (selectedOrder as Order)._id : ""}
                  >
                    <option value="" disabled>
                      Select an order
                    </option>
                    {associatedOrders?.map((order) => (
                      <option key={order._id} value={order._id}>
                        {order.details
                          .map((item) => `${item.product.name}: ${item.amount}`)
                          .join(", ")}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* New Fields */}
          <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
            <div className="flex-1">
              <label>
                Amount:
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </label>
            </div>

            <div className="flex-1">
              <label>
                Payment Type:
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="border p-3 rounded-md w-full"
                  required
                >
                  <option value="" disabled>
                    Select payment type
                  </option>
                  <option value="Advance">Advance</option>
                  <option value="Reservation">Reservation</option>
                  <option value="Guarantee">Guarantee</option>
                  <option value="Refund">Refund</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:gap-8">
            <div className="flex-1">
              <label>
                Modality:
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  className="border p-3 rounded-md w-full"
                  required
                >
                  <option value="" disabled>
                    Select modality
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </label>
            </div>

            <div className="flex-1">
              <label>
                Date:
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <label>
              Attachments:
              <input
                type="file"
                onChange={(e) => setAttachments(e.target.files)}
                className="border p-2 rounded-md w-full"
                multiple
              />
            </label>
          </div>

          <div className="flex flex-col">
            <label>
              Comments:
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
}
