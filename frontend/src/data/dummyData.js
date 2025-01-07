export const customerData = {
  id: 1,
  name: 'Sarah',
  surname: 'Johnson',
  address: '123 Wedding Street',
  city: 'Casablanca',
  phone: '+212 666-123456',
  whatsapp: '+212 666-123456',
  weddingDate: '2024-08-15',
  weddingTime: '14:00',
  weddingLocation: 'Royal Palace Hotel',
  type: 'Client'
}

export const reservationsData = [
  {
    id: 1,
    date: '2024-03-15',
    time: '10:00',
    service: 'Wedding Dress Fitting',
    status: 'Confirmed'
  },
  {
    id: 2,
    date: '2024-04-01',
    time: '15:30',
    service: 'Final Alterations',
    status: 'Pending'
  }
]

export const paymentsData = [
  {
    id: 1,
    date: '2024-02-01',
    amount: 5000,
    method: 'Credit Card',
    status: 'Paid'
  },
  {
    id: 2,
    date: '2024-03-01',
    amount: 3000,
    method: 'Cash',
    status: 'Pending'
  }
]

export const attachmentsData = [
  {
    id: 1,
    name: 'wedding-contract.pdf',
    type: 'application/pdf',
    size: 2500000,
    url: '/path/to/file.pdf'
  },
  {
    id: 2,
    name: 'dress-photo-1.jpg',
    type: 'image/jpeg',
    size: 1500000,
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  {
    id: 3,
    name: 'venue-photo.jpg',
    type: 'image/jpeg',
    size: 1800000,
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'
  }
] 