import { useState } from 'react'
import { Cross2Icon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'

const ViewReservation = ({ isOpen, onClose, reservation }) => {
  const [activeTab, setActiveTab] = useState('general')

  if (!isOpen || !reservation) return null

  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'items', label: 'Reserved Items' },
    { id: 'payments', label: 'Associated Payments' }
  ]

  const calculateFinancials = () => {
    const items = reservation.items || []
    const itemsTotal = items.reduce((sum, item) => sum + (item.rentalCost || 0), 0)
    
    const additionalCost = reservation.additionalCost ?? 0
    const travelCost = reservation.travelCost ?? 0
    
    const subtotal = itemsTotal + additionalCost + travelCost
    const securityDeposit = reservation.securityDeposit ?? (subtotal * 0.3)
    const advance = reservation.advance ?? (subtotal * 0.5)
    const total = reservation.total ?? (subtotal + securityDeposit)

    return {
      itemsTotal,
      subtotal,
      advance,
      securityDeposit,
      total
    }
  }

  const calculatePaymentDetails = () => {
    const financials = calculateFinancials()
    const totalPaid = reservation.payments?.reduce((sum, payment) => {
      if (payment.status === 'Completed' && payment.type !== 'Refund') {
        return sum + payment.amount
      }
      return sum
    }, 0) || 0
    
    const remaining = financials.total - totalPaid
    const percentage = (totalPaid / financials.total) * 100

    let paymentStatus = 'Unpaid'
    if (totalPaid >= financials.total) {
      paymentStatus = 'Paid'
    } else if (totalPaid > 0) {
      paymentStatus = 'Partial'
    }
    
    const hasRefund = reservation.payments?.some(payment => 
      payment.type === 'Refund' && payment.status === 'Completed'
    )
    if (hasRefund) {
      paymentStatus = 'Refunded'
    }

    return {
      totalPaid,
      remaining,
      percentage,
      paymentStatus
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Draft':
        return {
          color: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          icon: '📝',
          description: 'Reservation is in draft state'
        }
      case 'Confirmed':
        return {
          color: 'bg-green-500/10',
          textColor: 'text-green-400',
          icon: '✓',
          description: 'Reservation has been confirmed'
        }
      case 'Cancelled':
        return {
          color: 'bg-red-500/10',
          textColor: 'text-red-400',
          icon: '✕',
          description: 'Reservation has been cancelled'
        }
      default:
        return {
          color: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          icon: '•',
          description: 'Status unknown'
        }
    }
  }

  const renderGeneralInfo = () => {
    const financials = calculateFinancials()
    const paymentDetails = calculatePaymentDetails()
    const statusConfig = getStatusConfig(reservation.status)

    return (
      <div className="space-y-6">
        {/* Customer Information Section */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Customer Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <p className="text-white font-medium">{reservation.customer.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone Number</label>
                <p className="text-white font-medium">{reservation.customer.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">WhatsApp</label>
                <p className="text-white font-medium">{reservation.customer.whatsapp || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-400">Wedding Date</label>
                <p className="text-white font-medium">{reservation.customer.weddingDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Wedding City</label>
                <p className="text-white font-medium">{reservation.customer.weddingCity}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium">{reservation.customer.email || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Details Section - enhanced status design */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Reservation Details</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Reservation Type</label>
                <p className="text-white font-medium">{reservation.type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <div className="mt-1">
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${statusConfig.color}`}>
                    <span className="text-lg">{statusConfig.icon}</span>
                    <div>
                      <p className={`font-medium ${statusConfig.textColor}`}>
                        {reservation.status}
                      </p>
                      <p className="text-sm text-gray-400">
                        {statusConfig.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates and Buffer */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Pickup Date</label>
                <p className="text-white font-medium">
                  {new Date(reservation.pickupDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Return Date</label>
                <p className="text-white font-medium">
                  {new Date(reservation.returnDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Buffer Days</label>
                <p className="text-white font-medium">
                  Before: {reservation.bufferBefore} days | After: {reservation.bufferAfter} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Recap Section */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Financial Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Payment Status</label>
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      paymentDetails.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400' :
                      paymentDetails.paymentStatus === 'Partial' ? 'bg-yellow-500/10 text-yellow-400' :
                      paymentDetails.paymentStatus === 'Refunded' ? 'bg-gray-500/10 text-gray-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {paymentDetails.paymentStatus}
                    </span>
                  </p>
                  <div className="text-sm text-gray-400">
                    <p>Paid: ${paymentDetails.totalPaid.toLocaleString()} ({paymentDetails.percentage.toFixed(1)}%)</p>
                    {paymentDetails.remaining > 0 && paymentDetails.paymentStatus !== 'Refunded' && (
                      <p>Remaining: ${paymentDetails.remaining.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Security Deposit</label>
                <p className="text-white font-medium">
                  ${financials.securityDeposit.toLocaleString()} ({reservation.securityDepositPercentage}%)
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Advance Required</label>
                <p className="text-white font-medium">
                  ${financials.advance.toLocaleString()} ({reservation.advancePercentage}%)
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Items Total:</span>
                <span className="text-white">${financials.itemsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Additional Costs:</span>
                <span className="text-white">
                  ${(Number(reservation.additionalCost) + Number(reservation.travelCost)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Travel Cost:</span>
                <span className="text-white">${Number(reservation.travelCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Other Costs:</span>
                <span className="text-white">${Number(reservation.additionalCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Security Deposit:</span>
                <span className="text-white">${financials.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-white/10">
                <span className="text-gray-400">Total:</span>
                <span className="text-white">${financials.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {reservation.notes && (
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Notes</h3>
            <p className="text-gray-400">{reservation.notes}</p>
          </div>
        )}
      </div>
    )
  }

  const renderReservedItems = () => (
    <div className="space-y-4">
      {reservation.items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-white/5 rounded-lg p-4"
        >
          <img
            src={item.photo}
            alt={item.name}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="text-white font-medium">{item.name}</h4>
            <p className="text-sm text-gray-400">
              Rental Cost: ${item.rentalCost.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
        onClick={() => {/* Add payment logic */}}
      >
        <PlusIcon className="h-5 w-5" />
        Add Payment
      </button>

      <div className="bg-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Date</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Amount</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Type</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {reservation.payments?.map((payment) => (
              <tr key={payment.id}>
                <td className="p-4 text-white">
                  {format(new Date(payment.date), 'PP')}
                </td>
                <td className="p-4 text-white">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="p-4 text-white">{payment.type}</td>
                <td className="p-4 text-white">{payment.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 z-50">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Reservation #{reservation.id}
            </h2>
            <p className="text-sm text-gray-400">
              {reservation.customerName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {/* Download/Print contract logic */}}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <DownloadIcon className="h-5 w-5" />
              Download Contract
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Cross2Icon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'general' && renderGeneralInfo()}
          {activeTab === 'items' && renderReservedItems()}
          {activeTab === 'payments' && renderPayments()}
        </div>
      </div>
    </div>
  )
}

export default ViewReservation 