import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PlusIcon, 
  Pencil1Icon, 
  TrashIcon, 
  EyeOpenIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@radix-ui/react-icons'
import Pagination from '../components/Pagination'
import AddReservation from '../components/reservations/AddReservation'
import EditReservation from '../components/reservations/EditReservation'
import ViewReservation from '../components/reservations/ViewReservation'

// Add dummy clients data (used in reservations)
const dummyClients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    phone: '+212 666-123456',
    whatsapp: '+212 666-123456',
    identification: 'AB123456',
    weddingDate: '2024-08-15',
    weddingCity: 'Casablanca',
    email: 'sarah@example.com'
  },
  {
    id: 2,
    name: 'Emily Davis',
    phone: '+212 666-789012',
    whatsapp: '+212 666-789012',
    identification: 'CD789012',
    weddingDate: '2024-09-20',
    weddingCity: 'Rabat',
    email: 'emily@example.com'
  }
]

// Add dummy items data (used in reservations)
const dummyItems = [
  {
    id: 1,
    name: 'Classic White Lace Gown',
    category: 'Wedding Dresses',
    photo: 'https://images.unsplash.com/photo-1494955870715-979ca4f13bf0',
    rentalCost: 200,
    description: 'Beautiful classic lace wedding gown'
  },
  {
    id: 2,
    name: 'Crystal Tiara',
    category: 'Accessories',
    photo: 'https://images.unsplash.com/photo-1458538977777-0549b2370168',
    rentalCost: 50,
    description: 'Elegant crystal tiara'
  }
]

// Updated dummy reservations data
const dummyReservations = [
  {
    id: 1,
    type: 'Final',
    status: 'Draft',
    clientId: 1,
    customer: dummyClients[0],
    items: [dummyItems[0], dummyItems[1]],
    pickupDate: '2024-03-20',
    returnDate: '2024-03-25',
    additionalCost: 100,
    travelCost: 50,
    securityDepositPercentage: 30,
    advancePercentage: 50,
    notes: 'Bride prefers minimal alterations',
    bufferBefore: 3,
    bufferAfter: 3,
    payments: [
      {
        id: 1,
        date: '2024-03-15',
        amount: 175,
        type: 'Advance',
        method: 'Cash'
      }
    ],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 2,
    type: 'Fitting',
    status: 'Confirmed',
    clientId: 2,
    customer: dummyClients[1],
    items: [dummyItems[0]],
    pickupDate: '2024-04-05',
    returnDate: '2024-04-07',
    additionalCost: 50,
    travelCost: 30,
    securityDepositPercentage: 30,
    advancePercentage: 50,
    notes: 'First fitting session',
    bufferBefore: 2,
    bufferAfter: 2,
    payments: [],
    createdAt: '2024-03-12T14:30:00Z',
    updatedAt: '2024-03-12T14:30:00Z'
  }
]

const Reservations = () => {
  const [reservations] = useState(dummyReservations)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(reservation =>
    reservation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.items[0].name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)

  // Update getPaymentStatus to calculate based on payments
  const getPaymentStatus = (reservation) => {
    const financials = calculateFinancials(reservation)
    const totalPaid = reservation.payments.reduce((sum, payment) => sum + payment.amount, 0)
    
    if (totalPaid >= financials.total) return 'Paid'
    if (totalPaid > 0) return 'Partial'
    return 'Unpaid'
  }

  // Add calculateFinancials helper
  const calculateFinancials = (reservation) => {
    const itemsTotal = reservation.items.reduce((sum, item) => sum + item.rentalCost, 0)
    const additionalCosts = Number(reservation.additionalCost) + Number(reservation.travelCost)
    const subtotal = itemsTotal + additionalCosts
    const securityDeposit = (itemsTotal * (reservation.securityDepositPercentage / 100))
    const advance = subtotal * (reservation.advancePercentage / 100)
    const total = subtotal + securityDeposit

    return {
      itemsTotal,
      subtotal,
      securityDeposit,
      advance,
      total
    }
  }

  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation)
    setIsViewModalOpen(true)
  }

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation)
    setIsEditModalOpen(true)
  }

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
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">ID</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Created At</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Client Name</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Item</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Pickup Date</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Return Date</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Total</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Type</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Payment</th>
              <th className="text-right text-xs font-medium text-gray-400 uppercase p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {currentItems.map((reservation) => {
              const financials = calculateFinancials(reservation)
              const paymentStatus = getPaymentStatus(reservation)
              const mainItem = reservation.items[0] // Get first item for display

              return (
                <tr key={reservation.id} className="hover:bg-white/5">
                  <td className="p-4 text-white">#{reservation.id}</td>
                  <td className="p-4 text-white">
                    {new Date(reservation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-white">{reservation.customer.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={mainItem.photo}
                        alt={mainItem.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-white text-sm">{mainItem.name}</span>
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
                  <td className="p-4 text-white">${financials.total.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.type === 'Final' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {reservation.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400' :
                      paymentStatus === 'Partial' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
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
                      <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <TrashIcon className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
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
          setIsViewModalOpen(false)
          setSelectedReservation(null)
        }}
        reservation={selectedReservation}
      />

      {/* Edit Reservation Modal */}
      <EditReservation
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedReservation(null)
        }}
        reservation={selectedReservation}
      />
    </div>
  )
}

export default Reservations 