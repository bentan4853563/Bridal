import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";

import AddCustomer from "./AddCustomer";
import Pagination from "../components/Pagination";

import { handleDeleteCustomer } from "../actions/customer";
import { deleteCustomer } from "../store/reducers/customerSlice";

const Customers = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const customers = useSelector((state) => state.customer.customers); // Get customers from Redux
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCustomers = customers?.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleRowClick = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

  // Show add modal if navigating from quick actions
  useEffect(() => {
    if (location.state?.showAddModal) {
      setShowAddModal(true);
      // Clear the state after showing modal
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDelete = (customerId) => {
    {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        handleDeleteCustomer(customerId, () => {
          dispatch(deleteCustomer(customerId))
        })
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Customers</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Customer
          </button>
        </div>

        {/* Rest of your customers content */}
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Surname
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  CIN/Passport
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Wedding Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Wedding City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentItems.map((customer, index) => (
                <tr
                  key={customer._id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {customer.surname}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {customer.identification}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {customer.whatsapp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {customer.weddingDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {customer.weddingCity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div className="flex space-x-2">
                      <button
                        className="p-1 hover:bg-white/10 rounded"
                        title="View"
                        onClick={() => handleRowClick(customer._id)}
                      >
                        <EyeOpenIcon className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customer/${customer._id}/edit`);
                        }}
                      >
                        <Pencil1Icon className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        className="p-1 hover:bg-white/10 rounded"
                        title="Delete"
                        onClick={() => handleDelete(customer._id)}
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomer
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Customers;
