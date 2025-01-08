import React from 'react'

const CustomerPayments = ({ payments }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-white/5">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{payment.paymentDate.split('T')[0]}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${payment.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{payment.paymentMethod}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{payment.reservation.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerPayments 