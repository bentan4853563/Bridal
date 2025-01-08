import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import Pagination from "../components/Pagination";
import AddReservation from "../components/reservations/AddReservation";
import EditReservation from "../components/reservations/EditReservation";
import ViewReservation from "../components/reservations/ViewReservation";
import { addBaseURL } from "../utils/updateURL";
import { handleDeleteReservation } from "../actions/reservation";
import { deleteReservation } from "../store/reducers/reservationSlice";
import { useDispatch } from "react-redux";
import DeleteConfirmationModal from "../components/settings/DeleteConfirmationModal";

const Reservations = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.item.items);
  const clients = useSelector((state) => state.customer.customers);
  const reservations = useSelector((state) => state.reservation.reservations);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.client?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.items[0].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  // Update getPaymentStatus to calculate based on payments
  const getPaymentStatus = (reservation) => {
    const financials = calculateFinancials(reservation);
    const totalPaid = reservation.payments?.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    if (totalPaid >= financials.total) return "Paid";
    if (totalPaid > 0) return "Partial";
    return "Unpaid";
  };

  // Add calculateFinancials helper
  const calculateFinancials = (reservation) => {
    const itemsTotal = reservation.items.reduce(
      (sum, item) => sum + item.rentalCost,
      0
    );
    const additionalCosts =
      Number(reservation.additionalCost) + Number(reservation.travelCost);
    const subtotal = itemsTotal + additionalCosts;
    const securityDeposit =
      itemsTotal * (reservation.securityDepositPercentage / 100);
    const advance = subtotal * (reservation.advancePercentage / 100);
    const total = subtotal + securityDeposit;

    return {
      itemsTotal,
      subtotal,
      securityDeposit,
      advance,
      total,
    };
  };

  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation);
    setIsViewModalOpen(true);
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

  const deleteReservationData = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      handleDeleteReservation(id, () => {
        console.log('id :>> ', id);
        dispatch(deleteReservation(id));
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Reservations</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Reservation
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-white/20 bg-white/10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Updated table with reordered columns */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                ID
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Created At
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Client Name
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Item
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Pickup Date
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Return Date
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Total
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Type
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                Payment
              </th>
              <th className="text-right text-xs font-medium text-gray-400 uppercase p-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {currentItems.map((reservation, index) => {
              const financials = calculateFinancials(reservation);
              const paymentStatus = getPaymentStatus(reservation);
              const mainItem = reservation.items[0]; // Get first item for display

              return (
                <tr key={reservation.id} className="hover:bg-white/5">
                  <td className="p-4 text-white">#{index + 1}</td>
                  <td className="p-4 text-white">
                    {new Date(reservation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-white">{reservation.client?.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={addBaseURL(mainItem.primaryPhoto)}
                        alt={mainItem.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-white text-sm">
                          {mainItem.name}
                        </span>
                        {reservation.items.length > 1 && (
                          <span className="text-gray-400 text-xs">
                            +{reservation.items.length - 1} more items
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white">
                    {new Date(reservation.pickupDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-white">
                    {new Date(reservation.returnDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-white">
                    ${financials.total.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.type === "Final"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {reservation.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        paymentStatus === "Paid"
                          ? "bg-green-500/10 text-green-400"
                          : paymentStatus === "Partial"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewReservation(reservation)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <EyeOpenIcon className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleEditReservation(reservation)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Pencil1Icon className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => deleteReservationData(reservation._id)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Add Reservation Modal */}
      <AddReservation
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* View Reservation Modal */}
      <ViewReservation
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
      />

      {/* Edit Reservation Modal */}
      <EditReservation
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
      />
    </div>
  );
};

export default Reservations;
