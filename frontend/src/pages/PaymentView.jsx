import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  PersonIcon,
  CardStackIcon,
  CalendarIcon,
  ClockIcon,
  ImageIcon,
  FileIcon,
  DownloadIcon
} from '@radix-ui/react-icons'

// Dummy payment data - replace with API call
const dummyPayment = {
  id: 1,
  customerName: 'Sarah Johnson',
  customerId: 'CUST-001',
  reservationId: 'RES-001',
  reservationType: 'Final',
  reservationDetails: {
    pickupDate: '2024-04-15',
    returnDate: '2024-04-18',
    totalAmount: 5000,
    paidAmount: 2000,
    remainingAmount: 3000,
    status: 'Confirmed'
  },
  amount: 5000,
  paymentDate: '2024-03-15',
  paymentMethod: 'Cash',
  status: 'Paid',
  reference: 'PAY-001',
  paymentType: 'Advance',
  notes: 'Payment for wedding photography package',
  createdAt: '2024-03-15T10:30:00',
  updatedAt: '2024-03-15T10:30:00',
  attachments: [
    {
      id: 1,
      name: 'receipt.pdf',
      size: '156 KB',
      url: '/path/to/receipt.pdf'
    },
    {
      id: 2,
      name: 'payment_proof.jpg',
      size: '1.2 MB',
      url: 'https://picsum.photos/200/300',
      type: 'image/jpeg'
    },
    {
      id: 3,
      name: 'invoice_scan.jpg',
      size: '800 KB',
      url: 'https://picsum.photos/200/200',
      type: 'image/jpeg'
    }
  ]
}

const PaymentView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [payment, setPayment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        setPayment(dummyPayment)
      } catch (error) {
        console.error('Error fetching payment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayment()
  }, [id])

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-500/10 text-green-500'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'cancelled':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-4 text-white">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading payment details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/payments', { 
                state: { activeTab: 'Payments' } 
              })}
              className="p-2 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeftIcon className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-2xl font-semibold text-white">Payment Details</h2>
          </div>
          <button
            onClick={() => navigate(`/payment/${id}/edit`)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
          >
            Edit Payment
          </button>
        </div>

        {/* Payment Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6 space-y-6">
          {/* Status and Reference */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {payment.status}
            </span>
            <span className="text-sm text-gray-400">
              Reference: {payment.reference}
            </span>
          </div>

          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Customer</p>
              <div className="flex items-center space-x-2">
                <PersonIcon className="h-4 w-4 text-white/60" />
                <p className="text-white">{payment.customerName}</p>
              </div>
              <p className="text-sm text-gray-400">{payment.customerId}</p>
            </div>

            {/* Reservation Details */}
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Reservation</p>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-white/60" />
                <p className="text-white">#{payment.reservationId}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{payment.reservationType}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  payment.reservationDetails.status === 'Confirmed'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {payment.reservationDetails.status}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-gray-400">Total</div>
                  <div className="text-white">
                    ${payment.reservationDetails.totalAmount}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Paid</div>
                  <div className="text-green-500">
                    ${payment.reservationDetails.paidAmount}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Remaining</div>
                  <div className="text-yellow-500">
                    ${payment.reservationDetails.remainingAmount}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {payment.reservationDetails.pickupDate} - {payment.reservationDetails.returnDate}
              </div>
            </div>

            {/* Amount Details */}
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Amount</p>
              <div className="flex items-center space-x-2">
                <CardStackIcon className="h-4 w-4 text-white/60" />
                <p className="text-white">${payment.amount.toLocaleString()}</p>
              </div>
              <p className="text-sm text-gray-400">{payment.paymentMethod}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-400">Payment Date</p>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-white/60" />
                <p className="text-white">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-400">Created At</p>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-white/60" />
                <p className="text-white">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-400">Payment Type</p>
              <div className="flex items-center space-x-2">
                <CardStackIcon className="h-4 w-4 text-white/60" />
                <p className="text-white">{payment.paymentType}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="space-y-2 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">Notes</p>
              <p className="text-white">{payment.notes}</p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Payment History</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-white">Payment Created</span>
              </div>
              <span className="text-gray-400">
                {new Date(payment.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-white">Payment {payment.status}</span>
              </div>
              <span className="text-gray-400">
                {new Date(payment.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Attachments</h3>
          {payment.attachments.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {payment.attachments.map((file) => (
                <div key={file.id} className="flex items-center gap-4 rounded-lg border border-white/20 bg-white/5 p-4">
                  {file.type?.startsWith('image/') || file.url?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-white/10 bg-white/5">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                      <FileIcon className="h-5 w-5 text-white/60" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.size}</p>
                  </div>

                  <a
                    href={file.url}
                    download
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <DownloadIcon className="h-4 w-4 text-blue-400" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No attachments</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentView 