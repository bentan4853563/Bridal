import React from 'react'

const CustomerDetails = ({ customer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Name</label>
          <p className="text-white">{customer.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Surname</label>
          <p className="text-white">{customer.surname}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Address</label>
          <p className="text-white">{customer.address}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">City</label>
          <p className="text-white">{customer.city}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Phone</label>
          <p className="text-white">{customer.phone}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">WhatsApp</label>
          <p className="text-white">{customer.whatsapp}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Wedding Date & Time</label>
          <p className="text-white">{customer.weddingDate} at {customer.weddingTime}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Wedding Location</label>
          <p className="text-white">{customer.weddingLocation}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Type</label>
          <p className="text-white">{customer.type}</p>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetails 