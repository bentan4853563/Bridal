import { useState, useCallback } from 'react'
import { Cross2Icon, MagnifyingGlassIcon, UploadIcon, FileIcon, Cross1Icon } from '@radix-ui/react-icons'

// Dummy data for customers and reservations (replace with your actual data)
const dummyCustomers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    identification: 'AB123456',
    phone: '+212 666-123456',
  },
  // Add more customers...
]

const dummyReservations = [
  {
    id: 1,
    customerId: 1,
    totalAmount: 5000,
    paidAmount: 2000,
    remainingAmount: 3000,
    type: 'Final',
    status: 'Confirmed'
  },
  // Add more reservations...
]

const AddPayment = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    reservationId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0], // Today's date as default
    paymentMethod: '',
    paymentType: '',
    reference: '',
    notes: ''
  })

  // Search states
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)

  // Filter customers based on search
  const filteredCustomers = customerSearch.length >= 2
    ? dummyCustomers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.identification.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch)
      )
    : []

  // Get reservations for selected customer
  const customerReservations = selectedCustomer
    ? dummyReservations.filter(res => res.customerId === selectedCustomer.id)
    : []

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)
    setFormData(prev => ({ ...prev, customerId: customer.id }))
    setCustomerSearch(customer.name)
    setShowCustomerDropdown(false)
    setSelectedReservation(null)
    setFormData(prev => ({ ...prev, reservationId: '' }))
  }

  const handleReservationSelect = (reservation) => {
    setSelectedReservation(reservation)
    setFormData(prev => ({ ...prev, reservationId: reservation.id }))
  }

  // File upload states
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const fileInputRef = React.useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  const handleFiles = (newFiles) => {
    // Filter for allowed file types and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const validFiles = newFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type not allowed: ${file.name}`)
        return false
      }
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}`)
        return false
      }
      return true
    })

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.customerId || !formData.reservationId || !formData.amount || 
        !formData.paymentDate || !formData.paymentMethod || !formData.paymentType) {
      alert('Please fill in all required fields')
      return
    }

    try {
      // Create FormData for file upload
      const formDataToSubmit = new FormData()
      
      // Append payment data
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key])
      })
      
      // Append files
      files.forEach(file => {
        formDataToSubmit.append('files', file)
      })

      // TODO: Replace with your actual API call
      console.log('Submitting payment:', {
        ...formData,
        customerName: selectedCustomer?.name,
        reservationDetails: selectedReservation,
        files: files.map(f => f.name)
      })
      
      // Close modal after successful submission
      onClose()
    } catch (error) {
      console.error('Error submitting payment:', error)
      alert('Error submitting payment. Please try again.')
    }
  }

  const renderFileUpload = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-200">
        Attachments
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/20 hover:border-white/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
          <div className="mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:text-blue-400"
            >
              Upload files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileInput}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <p className="text-xs text-gray-400 mt-1">
              or drag and drop
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            PDF, PNG, JPG or JPEG (max. 5MB)
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5"
            >
              <div className="flex items-center space-x-2">
                <FileIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <Cross1Icon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderPaymentFields = () => (
    <>
      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">
          Amount <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Payment Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">
          Payment Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          value={formData.paymentDate}
          onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">
          Payment Method <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Select payment method</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Check">Check</option>
        </select>
      </div>

      {/* Payment Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">
          Payment Type <span className="text-red-400">*</span>
        </label>
        <select
          value={formData.paymentType}
          onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="">Select payment type</option>
          <option value="Advance">Advance Payment</option>
          <option value="Security">Security Deposit</option>
          <option value="Final">Final Payment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Reference Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Reference Number</label>
        <input
          type="text"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          placeholder="e.g., Transaction ID, Check number"
          className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes..."
          rows={3}
          className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {/* File Upload Section */}
      {renderFileUpload()}
    </>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 z-50">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-3xl my-8">
        <div className="sticky top-0 flex items-center justify-between mb-6 bg-gradient-to-br from-gray-900 to-gray-800 py-2">
          <h2 className="text-xl font-semibold text-white">Add New Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Customer</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value)
                      setShowCustomerDropdown(true)
                    }}
                    placeholder="Search customer by name, ID, or phone..."
                    className="w-full pl-9 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  
                  {/* Customer Dropdown */}
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleCustomerSelect(customer)}
                          className="w-full px-4 py-2 text-left hover:bg-white/5 text-white text-sm"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-400">
                            {customer.phone} • {customer.identification}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reservation Selection - Only shown if customer is selected */}
              {selectedCustomer && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Reservation</label>
                  <div className="grid grid-cols-1 gap-2">
                    {customerReservations.map((reservation) => (
                      <button
                        key={reservation.id}
                        type="button"
                        onClick={() => handleReservationSelect(reservation)}
                        className={`text-left p-3 rounded-lg border ${
                          selectedReservation?.id === reservation.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white">
                            Reservation #{reservation.id}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reservation.status === 'Confirmed'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Type: {reservation.type}
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-gray-400">Total</div>
                            <div className="text-white">${reservation.totalAmount}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Paid</div>
                            <div className="text-green-500">${reservation.paidAmount}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Remaining</div>
                            <div className="text-yellow-500">${reservation.remainingAmount}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {customerReservations.length === 0 && (
                      <p className="text-sm text-gray-400 p-3 border border-white/10 rounded-lg">
                        No reservations found for this customer
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Fields - Only shown if both customer and reservation are selected */}
              {selectedCustomer && selectedReservation && renderPaymentFields()}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCustomer || !selectedReservation}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPayment 