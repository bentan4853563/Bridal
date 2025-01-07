import { useState, useEffect } from 'react'
import { Cross2Icon, MagnifyingGlassIcon, CheckIcon } from '@radix-ui/react-icons'
import { format, addDays, subDays, isWithinInterval } from 'date-fns'
import { useNavigate } from 'react-router-dom'

// Dummy clients data (replace with your actual data source)
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
  // Add more dummy clients...
]

// Dummy items data (replace with your actual data source)
const dummyItems = [
  {
    id: 1,
    name: 'Classic White Lace Gown',
    photo: 'https://images.unsplash.com/photo-1494955870715-979ca4f13bf0',
    category: 'Bridal Dresses',
    subCategory: 'Wedding Gowns',
    rentalCost: 200,
    quantity: 2,
    reservations: [
      { pickupDate: '2024-04-15', returnDate: '2024-04-18' },
      { pickupDate: '2024-05-01', returnDate: '2024-05-04' }
    ]
  },
  // Add more dummy items...
]

const AddReservation = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    type: 'Final',
    clientId: '',
    items: [],
    pickupDate: '',
    returnDate: '',
    status: 'Draft',
    additionalCost: 0,
    travelCost: 0,
    bufferBefore: 3,
    bufferAfter: 3,
    securityDepositPercentage: 30,
    advancePercentage: 50,
    notes: ''
  })

  const [selectedClient, setSelectedClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [availableItems, setAvailableItems] = useState([])
  const [step, setStep] = useState(1)

  // Add new state for filtered clients
  const [filteredClients, setFilteredClients] = useState([])
  const [showClientDropdown, setShowClientDropdown] = useState(false)

  // Add new state for item selection
  const [selectedItems, setSelectedItems] = useState([])
  const [itemSearchTerm, setItemSearchTerm] = useState('')

  const steps = [
    { number: 1, title: 'Client Details' },
    { number: 2, title: 'Items & Dates' },
    { number: 3, title: 'Financial Details' }
  ]

  // Update search functionality
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = dummyClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.identification.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredClients(filtered)
      setShowClientDropdown(true)
    } else {
      setFilteredClients([])
      setShowClientDropdown(false)
    }
  }, [searchTerm])

  const handleClientSelect = (client) => {
    setSelectedClient(client)
    setFormData(prev => ({ ...prev, clientId: client.id }))
    setSearchTerm(client.name)
    setShowClientDropdown(false)
  }

  // Client details component
  const ClientDetails = ({ client }) => (
    <div className="bg-white/5 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-white">{client.name}</h3>
          <p className="text-sm text-gray-400">ID: {client.identification}</p>
        </div>
        <button
          onClick={() => {
            setSelectedClient(null)
            setFormData(prev => ({ ...prev, clientId: '' }))
            setSearchTerm('')
          }}
          className="p-1 hover:bg-white/10 rounded-lg"
        >
          <Cross2Icon className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Phone</label>
          <p className="text-white">{client.phone}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">WhatsApp</label>
          <p className="text-white">{client.whatsapp}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Wedding Date</label>
          <p className="text-white">{format(new Date(client.weddingDate), 'PPP')}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Wedding City</label>
          <p className="text-white">{client.weddingCity}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <p className="text-white">{client.email}</p>
        </div>
      </div>
    </div>
  )

  // Update the client search section in step 1
  const renderClientSearch = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        Search Client
      </label>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, or ID..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        
        {/* Dropdown for search results */}
        {showClientDropdown && filteredClients.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => handleClientSelect(client)}
                className="w-full px-4 py-2 text-left hover:bg-white/5 text-white text-sm"
              >
                <div className="font-medium">{client.name}</div>
                <div className="text-xs text-gray-400">
                  {client.phone} • {client.identification}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* No results message */}
      {showClientDropdown && filteredClients.length === 0 && searchTerm.length >= 2 && (
        <p className="text-sm text-gray-400 mt-2">No clients found</p>
      )}

      {/* Selected client details */}
      {selectedClient && <ClientDetails client={selectedClient} />}
    </div>
  )

  // Calculate financial details
  const calculateFinancials = () => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.rentalCost, 0)
    const additionalCosts = Number(formData.additionalCost) + Number(formData.travelCost)
    const subtotal = itemsTotal + additionalCosts
    
    // Calculate security deposit percentage from amount if it exists
    const securityDeposit = formData.securityDepositAmount || (itemsTotal * (formData.securityDepositPercentage / 100))
    const securityDepositPercentage = itemsTotal > 0 ? (securityDeposit / itemsTotal) * 100 : formData.securityDepositPercentage
    
    // Calculate advance percentage from amount if it exists
    const advance = formData.advanceAmount || (subtotal * (formData.advancePercentage / 100))
    const advancePercentage = subtotal > 0 ? (advance / subtotal) * 100 : formData.advancePercentage
    
    const total = subtotal + securityDeposit

    return {
      itemsTotal,
      additionalCosts,
      subtotal,
      advance,
      advancePercentage,
      securityDeposit,
      securityDepositPercentage,
      total
    }
  }

  // Add handlers for amount changes
  const handleSecurityDepositChange = (value, isAmount = false) => {
    if (isAmount) {
      const amount = Number(value)
      const percentage = selectedItems.reduce((sum, item) => sum + item.rentalCost, 0) > 0
        ? (amount / selectedItems.reduce((sum, item) => sum + item.rentalCost, 0)) * 100
        : 0
      setFormData(prev => ({
        ...prev,
        securityDepositAmount: amount,
        securityDepositPercentage: percentage
      }))
    } else {
      const percentage = Number(value)
      const amount = (percentage / 100) * selectedItems.reduce((sum, item) => sum + item.rentalCost, 0)
      setFormData(prev => ({
        ...prev,
        securityDepositAmount: amount,
        securityDepositPercentage: percentage
      }))
    }
  }

  const handleAdvanceChange = (value, isAmount = false) => {
    const subtotal = selectedItems.reduce((sum, item) => sum + item.rentalCost, 0) + 
                    Number(formData.additionalCost) + Number(formData.travelCost)
    
    if (isAmount) {
      const amount = Number(value)
      const percentage = subtotal > 0 ? (amount / subtotal) * 100 : 0
      setFormData(prev => ({
        ...prev,
        advanceAmount: amount,
        advancePercentage: percentage
      }))
    } else {
      const percentage = Number(value)
      const amount = (percentage / 100) * subtotal
      setFormData(prev => ({
        ...prev,
        advanceAmount: amount,
        advancePercentage: percentage
      }))
    }
  }

  // Check item availability considering wedding date and buffer times
  const checkItemAvailability = (item, pickupDate, returnDate) => {
    if (!selectedClient?.weddingDate) return true

    const pickup = new Date(pickupDate)
    const return_ = new Date(returnDate)
    const weddingDate = new Date(selectedClient.weddingDate)

    // Calculate buffer dates
    const bufferStartDate = subDays(weddingDate, formData.bufferBefore)
    const bufferEndDate = addDays(weddingDate, formData.bufferAfter)

    // Check if requested dates overlap with buffer period
    const isWithinBufferPeriod = isWithinInterval(pickup, {
      start: bufferStartDate,
      end: bufferEndDate
    }) || isWithinInterval(return_, {
      start: bufferStartDate,
      end: bufferEndDate
    })

    // If dates are within buffer period of wedding, check existing reservations
    if (isWithinBufferPeriod) {
      return !item.reservations.some(reservation => {
        const reservationPickup = new Date(reservation.pickupDate)
        const reservationReturn = new Date(reservation.returnDate)
        
        return (
          (pickup <= reservationReturn && return_ >= reservationPickup) ||
          isWithinInterval(reservationPickup, { start: pickup, end: return_ }) ||
          isWithinInterval(reservationReturn, { start: pickup, end: return_ })
        )
      })
    }

    return true
  }

  // Handle item selection
  const toggleItemSelection = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(i => i.id === item.id)
      if (isSelected) {
        return prev.filter(i => i.id !== item.id)
      } else {
        return [...prev, item]
      }
    })
  }

  // Add effect to update pickup and return dates when buffer times or wedding date changes
  useEffect(() => {
    if (selectedClient?.weddingDate) {
      const weddingDate = new Date(selectedClient.weddingDate)
      const pickupDate = subDays(weddingDate, formData.bufferBefore)
      const returnDate = addDays(weddingDate, formData.bufferAfter)
      
      setFormData(prev => ({
        ...prev,
        pickupDate: format(pickupDate, 'yyyy-MM-dd'),
        returnDate: format(returnDate, 'yyyy-MM-dd')
      }))
    }
  }, [selectedClient?.weddingDate, formData.bufferBefore, formData.bufferAfter])

  // Update the renderItemSelection function to include buffer fields
  const renderBufferTimeFields = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          Days Before Wedding
        </label>
        <input
          type="number"
          min="0"
          value={formData.bufferBefore}
          onChange={(e) => setFormData({ ...formData, bufferBefore: parseInt(e.target.value) })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          Days After Wedding
        </label>
        <input
          type="number"
          min="0"
          value={formData.bufferAfter}
          onChange={(e) => setFormData({ ...formData, bufferAfter: parseInt(e.target.value) })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      </div>
    </div>
  )

  // Update the renderItemSelection function to show date range
  const renderItemSelection = () => (
    <div className="space-y-6">
      {/* Wedding Date and Buffer Info */}
      {selectedClient && (
        <div className="bg-white/5 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Wedding Date</p>
              <p className="text-lg font-medium text-white">
                {format(new Date(selectedClient.weddingDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Pickup Date</p>
              <p className="text-lg font-medium text-white">
                {format(new Date(formData.pickupDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Return Date</p>
              <p className="text-lg font-medium text-white">
                {format(new Date(formData.returnDate), 'PPP')}
              </p>
            </div>
          </div>

          {/* Buffer Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Days Before Wedding
              </label>
              <input
                type="number"
                min="0"
                value={formData.bufferBefore}
                onChange={(e) => setFormData({ ...formData, bufferBefore: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Days After Wedding
              </label>
              <input
                type="number"
                min="0"
                value={formData.bufferAfter}
                onChange={(e) => setFormData({ ...formData, bufferAfter: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Item Search */}
      <div className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={itemSearchTerm}
            onChange={(e) => setItemSearchTerm(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        {/* Available Items Grid */}
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {getAvailableItems().map(item => (
            <div
              key={item.id}
              className={`relative rounded-lg border ${
                selectedItems.find(i => i.id === item.id)
                  ? 'border-blue-500'
                  : 'border-white/10'
              } overflow-hidden group cursor-pointer`}
              onClick={() => toggleItemSelection(item)}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.category}</p>
                <p className="text-sm font-medium text-white mt-2">
                  ${item.rentalCost.toLocaleString()}
                </p>
                {/* Add availability status */}
                <div className="mt-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                    Available for selected dates
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Update getAvailableItems to use the new availability check
  const getAvailableItems = () => {
    if (!formData.pickupDate || !formData.returnDate || !selectedClient?.weddingDate) return []

    return dummyItems.filter(item => {
      const isAvailable = checkItemAvailability(item, formData.pickupDate, formData.returnDate)
      const matchesSearch = itemSearchTerm === '' ||
        item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(itemSearchTerm.toLowerCase())

      return isAvailable && matchesSearch
    })
  }

  // Update step 3 to include financial details
  const renderFinancialDetails = () => {
    const financials = calculateFinancials()

    return (
      <div className="space-y-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="Draft">Draft</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        {/* Additional Costs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Additional Cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={formData.additionalCost}
                onChange={(e) => setFormData({ ...formData, additionalCost: e.target.value })}
                className="w-full pl-8 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Travel Cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={formData.travelCost}
                onChange={(e) => setFormData({ ...formData, travelCost: e.target.value })}
                className="w-full pl-8 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white/5 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">Financial Summary</h3>
          
          <div className="space-y-3">
            {/* Items Total */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Items Total</span>
              <span className="text-white">${financials.itemsTotal.toLocaleString()}</span>
            </div>
            
            {/* Security Deposit */}
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Security Deposit</span>
                <div className="relative w-20">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={financials.securityDepositPercentage.toFixed(1)}
                    onChange={(e) => handleSecurityDepositChange(e.target.value)}
                    className="w-full px-2 py-1 text-right rounded border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
                <span className="text-gray-400">of Items Total</span>
              </div>
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  value={formData.securityDepositAmount || financials.securityDeposit}
                  onChange={(e) => handleSecurityDepositChange(e.target.value, true)}
                  className="w-full pl-8 pr-4 py-1 rounded border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-right"
                />
              </div>
            </div>

            {/* Additional Costs */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Additional Cost</span>
              <span className="text-white">${Number(formData.additionalCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Travel Cost</span>
              <span className="text-white">${Number(formData.travelCost).toLocaleString()}</span>
            </div>

            {/* Subtotal */}
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-gray-200 font-medium">Subtotal</span>
              <span className="text-white font-medium">${financials.subtotal.toLocaleString()}</span>
            </div>

            {/* Required Advance */}
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Required Advance</span>
                <div className="relative w-20">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={financials.advancePercentage.toFixed(1)}
                    onChange={(e) => handleAdvanceChange(e.target.value)}
                    className="w-full px-2 py-1 text-right rounded border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
                <span className="text-gray-400">of Subtotal</span>
              </div>
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  value={formData.advanceAmount || financials.advance}
                  onChange={(e) => handleAdvanceChange(e.target.value, true)}
                  className="w-full pl-8 pr-4 py-1 rounded border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-right"
                />
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-gray-200 font-medium">Total</span>
              <span className="text-white font-medium">${financials.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Add any additional notes..."
          />
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    const financials = calculateFinancials()
    
    try {
      // Create the reservation object matching the actual data structure
      const reservationData = {
        id: Math.floor(Math.random() * 1000), // This will be handled by the backend
        customerName: selectedClient.name,
        type: formData.type,
        status: formData.status,
        paymentStatus: 'Pending',
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        items: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          photo: item.photo,
          rentalCost: item.rentalCost
        })),
        additionalCost: Number(formData.additionalCost),
        travelCost: Number(formData.travelCost),
        securityDeposit: financials.securityDeposit,
        advance: financials.advance,
        total: financials.total,
        payments: [], // Will be populated later
        customer: {
          id: selectedClient.id,
          name: selectedClient.name,
          phone: selectedClient.phone,
          whatsapp: selectedClient.whatsapp,
          identification: selectedClient.identification,
          weddingDate: selectedClient.weddingDate,
          weddingCity: selectedClient.weddingCity,
          email: selectedClient.email
        },
        notes: formData.notes,
        bufferBefore: formData.bufferBefore,
        bufferAfter: formData.bufferAfter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Mock API call for testing
      const mockApiCall = () => {
        return new Promise((resolve) => {
          // Store in dummyReservations or your data source
          const result = { ...reservationData }
          setTimeout(() => {
            resolve({
              success: true,
              data: result
            })
          }, 1000)
        })
      }

      const result = await mockApiCall()
      
      if (result.success) {
        // Add to your reservations state/store if needed
        onClose()
        navigate('/reservations')
      } else {
        throw new Error('Failed to create reservation')
      }
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert('Failed to create reservation. Please try again.')
    }
  }

  // Separate validation for each step
  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        // Validate client selection and type
        return selectedClient && formData.type
      case 2:
        // Validate dates and items selection
        return formData.pickupDate && 
               formData.returnDate && 
               selectedItems.length > 0
      case 3:
        // Validate financials
        const financials = calculateFinancials()
        return financials.total > 0 && formData.status
      default:
        return false
    }
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  // Handle previous step
  const handlePreviousStep = () => {
    setStep(Math.max(1, step - 1))
  }

  // Update the navigation buttons render
  const renderNavigationButtons = () => (
    <div className="flex justify-between mt-8">
      <button
        onClick={handlePreviousStep}
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
          Create Reservation
        </button>
      ) : (
        <button
          onClick={handleNextStep}
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
  )

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 z-50">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            New Reservation
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
              Create Reservation
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

export default AddReservation 