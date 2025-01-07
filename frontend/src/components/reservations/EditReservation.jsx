import { useState, useEffect } from 'react'
import { Cross2Icon, PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

// Add dummy clients data
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
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    phone: '+212 666-345678',
    whatsapp: '+212 666-345678',
    identification: 'EF345678',
    weddingDate: '2024-10-05',
    weddingCity: 'Marrakech',
    email: 'maria@example.com'
  }
]

// Add dummy items data
const dummyItems = [
  {
    id: 1,
    name: 'Classic White Lace Gown',
    category: 'Wedding Dresses',
    photo: 'https://images.unsplash.com/photo-1494955870715-979ca4f13bf0',
    rentalCost: 200,
    description: 'Beautiful classic lace wedding gown',
    status: 'Available'
  },
  {
    id: 2,
    name: 'Crystal Tiara',
    category: 'Accessories',
    photo: 'https://images.unsplash.com/photo-1458538977777-0549b2370168',
    rentalCost: 50,
    description: 'Elegant crystal tiara',
    status: 'Available'
  },
  // ... more items
]

const EditReservation = ({ isOpen, onClose, reservation }) => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [formData, setFormData] = useState({
    type: 'Final',
    status: 'Draft',
    pickupDate: '',
    returnDate: '',
    additionalCost: 0,
    travelCost: 0,
    securityDepositPercentage: 30,
    advancePercentage: 50,
    notes: '',
    bufferBefore: 3,
    bufferAfter: 3
  })

  // Add state for financial input type
  const [financialInputType, setFinancialInputType] = useState({
    securityDeposit: 'percentage', // or 'amount'
    advance: 'percentage' // or 'amount'
  })

  // Add state for item selection
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [itemSearchTerm, setItemSearchTerm] = useState('')
  const [availableItems, setAvailableItems] = useState(dummyItems)

  // Filter available items based on search and dates
  const filteredItems = availableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(itemSearchTerm.toLowerCase())
    const isAvailable = !selectedItems.some(selected => selected.id === item.id)
    return matchesSearch && isAvailable
  })

  // Load reservation data when component mounts
  useEffect(() => {
    if (reservation) {
      setSelectedClient(reservation.customer)
      setSelectedItems(reservation.items)
      setFormData({
        type: reservation.type,
        status: reservation.status,
        pickupDate: reservation.pickupDate,
        returnDate: reservation.returnDate,
        additionalCost: reservation.additionalCost,
        travelCost: reservation.travelCost,
        securityDepositPercentage: reservation.securityDepositPercentage,
        advancePercentage: reservation.advancePercentage,
        notes: reservation.notes,
        bufferBefore: reservation.bufferBefore,
        bufferAfter: reservation.bufferAfter
      })
    }
  }, [reservation])

  const calculateFinancials = () => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.rentalCost, 0)
    const additionalCosts = Number(formData.additionalCost) + Number(formData.travelCost)
    const subtotal = itemsTotal + additionalCosts
    const securityDeposit = itemsTotal * (formData.securityDepositPercentage / 100)
    const advance = subtotal * (formData.advancePercentage / 100)
    const total = subtotal + securityDeposit

    return {
      itemsTotal,
      subtotal,
      securityDeposit,
      advance,
      total
    }
  }

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return selectedClient && formData.type
      case 2:
        return formData.pickupDate && 
               formData.returnDate && 
               selectedItems.length > 0
      case 3:
        const financials = calculateFinancials()
        return financials.total > 0 && formData.status
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    const financials = calculateFinancials()
    
    try {
      const reservationData = {
        id: reservation.id,
        clientId: selectedClient.id,
        type: formData.type,
        status: formData.status,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        items: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          rentalCost: item.rentalCost
        })),
        financials: {
          itemsTotal: financials.itemsTotal,
          additionalCost: Number(formData.additionalCost),
          travelCost: Number(formData.travelCost),
          subtotal: financials.subtotal,
          securityDeposit: financials.securityDeposit,
          securityDepositPercentage: formData.securityDepositPercentage,
          advance: financials.advance,
          advancePercentage: formData.advancePercentage,
          total: financials.total
        },
        customer: {
          id: selectedClient.id,
          name: selectedClient.name,
          phone: selectedClient.phone,
          weddingDate: selectedClient.weddingDate
        },
        notes: formData.notes,
        bufferBefore: formData.bufferBefore,
        bufferAfter: formData.bufferAfter
      }

      // Mock API call for testing
      const mockApiCall = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              data: reservationData
            })
          }, 1000)
        })
      }

      const result = await mockApiCall()
      
      if (result.success) {
        onClose()
        navigate('/reservations')
      } else {
        throw new Error('Failed to update reservation')
      }
    } catch (error) {
      console.error('Error updating reservation:', error)
      alert('Failed to update reservation. Please try again.')
    }
  }

  const renderClientSelection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Select Client
        </label>
        <div className="relative">
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = dummyClients.find(c => c.id === Number(e.target.value))
              setSelectedClient(client)
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {dummyClients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.phone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClient && (
        <div className="bg-white/5 p-4 rounded-lg space-y-2">
          <p className="text-white font-medium">{selectedClient.name}</p>
          <p className="text-sm text-gray-400">{selectedClient.phone}</p>
          <p className="text-sm text-gray-400">Wedding Date: {selectedClient.weddingDate}</p>
          <p className="text-sm text-gray-400">City: {selectedClient.weddingCity}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Reservation Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Final">Final</option>
          <option value="Fitting">Fitting</option>
        </select>
      </div>
    </div>
  )

  const renderItemSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-400">
          Selected Items
        </label>
        <button
          onClick={() => setIsItemModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-4">
        {selectedItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <img
                src={item.photo}
                alt={item.name}
                className="h-16 w-16 object-cover rounded-lg"
              />
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">${item.rentalCost}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Item Selection Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Add Items</h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Cross2Icon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={itemSearchTerm}
                onChange={(e) => setItemSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Available Items */}
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItems([...selectedItems, item])
                    setIsItemModalOpen(false)
                  }}
                  className="flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">${item.rentalCost}</p>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      Available
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Pickup Date
          </label>
          <input
            type="date"
            value={formData.pickupDate}
            onChange={(e) => {
              setFormData({ ...formData, pickupDate: e.target.value })
              // Here you would check item availability for new dates
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Return Date
          </label>
          <input
            type="date"
            value={formData.returnDate}
            onChange={(e) => {
              setFormData({ ...formData, returnDate: e.target.value })
              // Here you would check item availability for new dates
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )

  const renderFinancialDetails = () => {
    const financials = calculateFinancials()

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Draft">Draft</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Additional Cost
            </label>
            <input
              type="number"
              value={formData.additionalCost}
              onChange={(e) => setFormData({ ...formData, additionalCost: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Travel Cost
            </label>
            <input
              type="number"
              value={formData.travelCost}
              onChange={(e) => setFormData({ ...formData, travelCost: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Security Deposit
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFinancialInputType(prev => ({
                    ...prev,
                    securityDeposit: 'percentage'
                  }))}
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.securityDeposit === 'percentage'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() => setFinancialInputType(prev => ({
                    ...prev,
                    securityDeposit: 'amount'
                  }))}
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.securityDeposit === 'amount'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  $
                </button>
              </div>
            </div>
            <input
              type="number"
              value={
                financialInputType.securityDeposit === 'percentage'
                  ? formData.securityDepositPercentage
                  : financials.securityDeposit
              }
              onChange={(e) => {
                const value = Number(e.target.value)
                if (financialInputType.securityDeposit === 'percentage') {
                  setFormData(prev => ({
                    ...prev,
                    securityDepositPercentage: value
                  }))
                } else {
                  const itemsTotal = financials.itemsTotal
                  const percentage = (value / itemsTotal) * 100
                  setFormData(prev => ({
                    ...prev,
                    securityDepositPercentage: percentage
                  }))
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Advance Payment
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFinancialInputType(prev => ({
                    ...prev,
                    advance: 'percentage'
                  }))}
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.advance === 'percentage'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() => setFinancialInputType(prev => ({
                    ...prev,
                    advance: 'amount'
                  }))}
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.advance === 'amount'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  $
                </button>
              </div>
            </div>
            <input
              type="number"
              value={
                financialInputType.advance === 'percentage'
                  ? formData.advancePercentage
                  : financials.advance
              }
              onChange={(e) => {
                const value = Number(e.target.value)
                if (financialInputType.advance === 'percentage') {
                  setFormData(prev => ({
                    ...prev,
                    advancePercentage: value
                  }))
                } else {
                  const subtotal = financials.subtotal
                  const percentage = (value / subtotal) * 100
                  setFormData(prev => ({
                    ...prev,
                    advancePercentage: percentage
                  }))
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Items Total:</span>
            <span className="text-white">${financials.itemsTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Additional Costs:</span>
            <span className="text-white">
              ${(Number(formData.additionalCost) + Number(formData.travelCost)).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Security Deposit:</span>
            <span className="text-white">${financials.securityDeposit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Advance Payment:</span>
            <span className="text-white">${financials.advance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t border-white/10">
            <span className="text-gray-400">Total:</span>
            <span className="text-white">${financials.total.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderClientSelection()
      case 2:
        return renderItemSelection()
      case 3:
        return renderFinancialDetails()
      default:
        return null
    }
  }

  const steps = [
    { number: 1, title: 'Client Details' },
    { number: 2, title: 'Items & Dates' },
    { number: 3, title: 'Financial Details' }
  ]

  if (!isOpen || !reservation) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 z-50">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Edit Reservation #{reservation?.id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div
                key={stepItem.number}
                className={`flex-1 relative ${
                  index !== steps.length - 1 ? 'after:content-[""] after:absolute after:top-[15px] after:left-[calc(50%+24px)] after:w-[calc(100%-48px)] after:h-[2px]' : ''
                }`}
              >
                <div className={`relative z-10 flex flex-col items-center ${
                  index !== steps.length - 1 ? 'after:bg-white/10' : ''
                }`}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-2 transition-colors ${
                      step >= stepItem.number
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {stepItem.number}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    step >= stepItem.number ? 'text-white' : 'text-gray-400'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
                {index !== steps.length - 1 && (
                  <div className={`absolute top-[15px] left-[calc(50%+24px)] w-[calc(100%-48px)] h-[2px] ${
                    step > stepItem.number ? 'bg-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
              step === 1 ? 'invisible' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Previous
          </button>
          
          {step === 3 ? (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(step)}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                validateStep(step)
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-blue-500/50 cursor-not-allowed'
              }`}
            >
              Update Reservation
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!validateStep(step)}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                validateStep(step)
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-blue-500/50 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditReservation 