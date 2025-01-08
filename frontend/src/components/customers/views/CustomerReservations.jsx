import React from 'react'

const CustomerReservations = ({ reservations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {reservations?.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-white/5">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {reservation.createdAt.split("T")[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {reservation.createdAt.split("T")[1].split('.')[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {reservation.service}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {reservation.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerReservations 