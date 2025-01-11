import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import AddPayment from "./AddPayment";
import Pagination from "../components/Pagination";
import { handleDeletePayment } from "../actions/payment";
import { deletePayment } from "../store/reducers/paymentSlice";

const Payments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const payments = useSelector((state) => state.payment.payments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPayments = payments?.filter(
    (payment) =>
      payment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments?.length / itemsPerPage);

  // const getStatusColor = (status) => {
  //   switch (status.toLowerCase()) {
  //     case "paid":
  //       return "bg-green-500/10 text-green-500";
  //     case "pending":
  //       return "bg-yellow-500/10 text-yellow-500";
  //     case "cancelled":
  //       return "bg-red-500/10 text-red-500";
  //     default:
  //       return "bg-gray-500/10 text-gray-500";
  //   }
  // };

  const handleRowClick = (paymentId) => {
    navigate(`/payment/${paymentId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      handleDeletePayment(id, () => {
        dispatch(deletePayment(id))
      })
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Payments</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Payment
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-white/20 bg-white/10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
              <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Id
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Reference
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Method
                </th>
                <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Type
                </th>
                {/* <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Status
                </th> */}
                <th className="text-right text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentItems?.map((payment, index) => (
                <tr
                  key={payment.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {payment.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {payment.client.name}{" "}{payment.client.surname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {payment.paymentType}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        payment.reservation.paymentStatus
                      )}`}
                    >
                      {payment.reservation.paymentStatus}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-1 hover:bg-white/10 rounded"
                        title="View"
                        onClick={() => handleRowClick(payment._id)}
                      >
                        <EyeOpenIcon className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/payment/${payment._id}/edit`);
                        }}
                      >
                        <Pencil1Icon className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        className="p-1 hover:bg-white/10 rounded"
                        title="Delete"
                        onClick={() => handleDelete(payment._id)}
                      >
                        <TrashIcon className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Add Payment Modal */}
      {showAddModal && (
        <AddPayment
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Payments;
