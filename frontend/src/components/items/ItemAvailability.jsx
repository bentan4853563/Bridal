import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Calendar.css'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const ItemAvailability = ({ item }) => {
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date('2024-12-15'))

  const events = [
    {
      id: 1,
      title: `${item.name} - Morning Setup`,
      start: new Date(2024, 11, 15, 9, 0),
      end: new Date(2024, 11, 15, 11, 0),
      status: 'Confirmed',
      customer: {
        name: 'Michael Chen',
        email: 'michael.c@email.com',
        phone: '+1 234-567-8906'
      },
      rentalDetails: {
        cost: item.rentalCost * 0.5,
        deposit: item.rentalCost * 0.2,
        notes: 'Setup for Holiday Gala'
      }
    },
    {
      id: 2,
      title: `${item.name} - Afternoon Rehearsal`,
      start: new Date(2024, 11, 15, 13, 0),
      end: new Date(2024, 11, 15, 15, 0),
      status: 'Reserved',
      customer: {
        name: 'Michael Chen',
        email: 'michael.c@email.com',
        phone: '+1 234-567-8906'
      },
      rentalDetails: {
        cost: item.rentalCost * 0.5,
        deposit: item.rentalCost * 0.2,
        notes: 'Rehearsal for Holiday Gala'
      }
    },
    {
      id: 3,
      title: `${item.name} - Holiday Gala Event`,
      start: new Date(2024, 11, 15, 17, 0),
      end: new Date(2024, 11, 15, 23, 0),
      status: 'Confirmed',
      customer: {
        name: 'Michael Chen',
        email: 'michael.c@email.com',
        phone: '+1 234-567-8906'
      },
      rentalDetails: {
        cost: item.rentalCost * 2,
        deposit: item.rentalCost * 0.5,
        notes: 'Main Holiday Gala Event'
      }
    },
    {
      id: 4,
      title: `${item.name} - Christmas Eve Setup`,
      start: new Date(2024, 11, 24, 14, 0),
      end: new Date(2024, 11, 24, 16, 0),
      status: 'Reserved',
      customer: {
        name: 'Amanda Wilson',
        email: 'amanda.w@email.com',
        phone: '+1 234-567-8907'
      },
      rentalDetails: {
        cost: item.rentalCost * 0.5,
        notes: 'Setup for Christmas Eve Party'
      }
    },
    {
      id: 5,
      title: `${item.name} - Christmas Eve Party`,
      start: new Date(2024, 11, 24, 18, 0),
      end: new Date(2024, 11, 24, 23, 59),
      status: 'Reserved',
      customer: {
        name: 'Amanda Wilson',
        email: 'amanda.w@email.com',
        phone: '+1 234-567-8907'
      },
      rentalDetails: {
        cost: item.rentalCost * 1.5,
        deposit: item.rentalCost * 0.4,
        notes: 'Private family celebration'
      }
    },
    {
      id: 6,
      title: `${item.name} - NYE Setup`,
      start: new Date(2024, 11, 31, 10, 0),
      end: new Date(2024, 11, 31, 14, 0),
      status: 'Confirmed',
      customer: {
        name: 'Robert Martinez',
        email: 'robert.m@email.com',
        phone: '+1 234-567-8908'
      },
      rentalDetails: {
        cost: item.rentalCost,
        notes: 'New Year\'s Eve Event Setup'
      }
    },
    {
      id: 7,
      title: `${item.name} - NYE Event`,
      start: new Date(2024, 11, 31, 20, 0),
      end: new Date(2024, 11, 31, 23, 59),
      status: 'Confirmed',
      customer: {
        name: 'Robert Martinez',
        email: 'robert.m@email.com',
        phone: '+1 234-567-8908'
      },
      rentalDetails: {
        cost: item.rentalCost * 3,
        deposit: item.rentalCost * 0.6,
        notes: 'Luxury NYE celebration'
      }
    }
  ]

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.status === 'Confirmed' ? 'rgba(59, 130, 246, 0.2)' : 
                      event.status === 'Reserved' ? 'rgba(234, 179, 8, 0.2)' : 
                      'rgba(107, 114, 128, 0.2)',
      color: event.status === 'Confirmed' ? '#60a5fa' : 
             event.status === 'Reserved' ? '#fcd34d' : 
             '#9ca3af',
      borderRadius: '6px',
      border: `1px solid ${
        event.status === 'Confirmed' ? 'rgba(59, 130, 246, 0.3)' : 
        event.status === 'Reserved' ? 'rgba(234, 179, 8, 0.3)' : 
        'rgba(107, 114, 128, 0.3)'
      }`,
      fontSize: '0.875rem',
      padding: '2px 6px'
    }
    return {
      style
    }
  }

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event)
    alert(`
      Event: ${event.title}
      Status: ${event.status}
      Customer: ${event.customer.name}
      Time: ${event.start.toLocaleString()} - ${event.end.toLocaleString()}
      Notes: ${event.rentalDetails.notes}
    `)
  }

  return (
    <div className="space-y-6">
      <div className="h-[600px] bg-white/5 rounded-lg p-4 border border-white/10">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={date => setCurrentDate(date)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          className="custom-calendar"
          views={['month', 'week', 'day']}
          defaultView="month"
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 23, 59, 0)}
          step={30}
          timeslots={2}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/30"></span>
          <span className="text-sm text-gray-400">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></span>
          <span className="text-sm text-gray-400">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-500/20 border border-gray-500/30"></span>
          <span className="text-sm text-gray-400">Pending</span>
        </div>
      </div>
    </div>
  )
}

export default ItemAvailability