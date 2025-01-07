import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  PersonIcon,
  CardStackIcon,
  CalendarIcon,
  BoxIcon,
  ArrowDownIcon,
  MixerHorizontalIcon,
  PlusIcon
} from '@radix-ui/react-icons'
import Navbar from '../components/Navbar'
import * as Popover from '@radix-ui/react-popover'
import { ErrorBoundary } from 'react-error-boundary'
import StatsWidget from '../components/dashboard/StatsWidget'
import PickupsWidget from '../components/dashboard/PickupsWidget'
import ReturnsWidget from '../components/dashboard/ReturnsWidget'
import WidgetManager from '../components/dashboard/WidgetManager'
import RecentActivityWidget from '../components/dashboard/RecentActivityWidget'
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget'
import SystemHealthWidget from '../components/dashboard/SystemHealthWidget'
import ErrorFallback from '../components/ErrorBoundary'
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  subMonths,
  addDays,
  format 
} from 'date-fns';

const PREDEFINED_RANGES = {
  'Today': {
    startDate: (() => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      return date;
    })(),
    endDate: (() => {
      const date = new Date();
      date.setHours(23, 59, 59, 999);
      return date;
    })()
  },
  'This Week': {
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date())
  },
  'This Month': {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date())
  },
  'Last Month': {
    startDate: startOfMonth(subMonths(new Date(), 1)),
    endDate: endOfMonth(subMonths(new Date(), 1))
  },
  'This Year': {
    startDate: startOfYear(new Date()),
    endDate: endOfYear(new Date())
  }
};

const DUMMY_DATA = {
  pickups: [
    {
      id: 'p1',
      customerName: 'Sophie Anderson',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      status: 'Confirmed',
      items: [
        { id: 'dress1', name: 'Vera Wang Classic', size: 'US 6', type: 'Wedding Dress' },
        { id: 'veil1', name: 'Cathedral Length Veil', type: 'Accessory' }
      ]
    },
    {
      id: 'p2',
      customerName: 'Emily Martinez',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      status: 'Pending',
      items: [
        { id: 'dress2', name: 'Pronovias Elegance', size: 'US 8', type: 'Wedding Dress' },
        { id: 'tiara1', name: 'Crystal Tiara', type: 'Accessory' },
        { id: 'veil2', name: 'Fingertip Length Veil', type: 'Accessory' }
      ]
    },
    {
      id: 'p3',
      customerName: 'Jessica Thompson',
      date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      status: 'In Progress',
      items: [
        { id: 'dress3', name: 'Maggie Sottero Lace', size: 'US 4', type: 'Wedding Dress' }
      ]
    },
    {
      id: 'p4',
      customerName: 'Rachel Chen',
      date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      status: 'Confirmed',
      items: [
        { id: 'dress4', name: 'Essence of Australia', size: 'US 10', type: 'Wedding Dress' },
        { id: 'veil3', name: 'Blusher Veil', type: 'Accessory' }
      ]
    },
    {
      id: 'p5',
      customerName: 'Lauren Wilson',
      date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      status: 'Pending',
      items: [
        { id: 'dress5', name: 'Stella York A-Line', size: 'US 6', type: 'Wedding Dress' },
        { id: 'belt1', name: 'Crystal Belt', type: 'Accessory' }
      ]
    },
    // Last month's data
    {
      id: 'p6',
      customerName: 'Maria Garcia',
      date: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
      status: 'Completed',
      items: [
        { id: 'dress6', name: 'Allure Bridals', size: 'US 8', type: 'Wedding Dress' }
      ]
    }
  ],
  returns: [
    {
      id: 'r1',
      customerName: 'Victoria Brown',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      status: 'Confirmed',
      items: [
        { id: 'dress7', name: 'Mori Lee Ballgown', size: 'US 4', type: 'Wedding Dress' },
        { id: 'veil4', name: 'Chapel Length Veil', type: 'Accessory' }
      ]
    },
    {
      id: 'r2',
      customerName: 'Amanda White',
      date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      status: 'Pending',
      items: [
        { id: 'dress8', name: 'Justin Alexander', size: 'US 6', type: 'Wedding Dress' }
      ]
    },
    {
      id: 'r3',
      customerName: 'Sarah Johnson',
      date: format(addDays(new Date(), 4), 'yyyy-MM-dd'),
      status: 'Completed',
      items: [
        { id: 'dress9', name: 'Enzoani Fit & Flare', size: 'US 8', type: 'Wedding Dress' },
        { id: 'tiara2', name: 'Pearl Tiara', type: 'Accessory' }
      ]
    },
    {
      id: 'r4',
      customerName: 'Michelle Lee',
      date: format(addDays(new Date(), 6), 'yyyy-MM-dd'),
      status: 'Pending',
      items: [
        { id: 'dress10', name: 'Watters Mermaid', size: 'US 10', type: 'Wedding Dress' },
        { id: 'veil5', name: 'Fingertip Veil', type: 'Accessory' }
      ]
    },
    // Last month's data
    {
      id: 'r5',
      customerName: 'Jennifer Davis',
      date: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
      status: 'Completed',
      items: [
        { id: 'dress11', name: 'Casablanca Bridal', size: 'US 6', type: 'Wedding Dress' },
        { id: 'belt2', name: 'Beaded Belt', type: 'Accessory' }
      ]
    }
  ]
};

const DashboardContent = () => {
  const navigate = useNavigate()
  const [dateRanges, setDateRanges] = useState({
    pickup: PREDEFINED_RANGES['This Week'],
    return: PREDEFINED_RANGES['This Week']
  })
  const [activeRange, setActiveRange] = useState({
    pickup: 'This Week',
    return: 'This Week'
  })

  // Define widgets first, outside of any hooks or state
  const availableWidgets = [
    { id: 'stats', label: 'Statistics', width: 'full' },
    { id: 'pickups', label: 'Upcoming Pickups', width: 'half' },
    { id: 'returns', label: 'Upcoming Returns', width: 'half' },
    { id: 'activity', label: 'Recent Activity', width: 'full' },
    { id: 'quickActions', label: 'Quick Actions', width: 'half' },
    { id: 'systemHealth', label: 'System Health', width: 'half' }
  ]

  // Then use availableWidgets in your state
  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    const saved = localStorage.getItem('visibleWidgets')
    return saved ? JSON.parse(saved) : availableWidgets.map(w => w.id)
  })

  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem('widgetOrder')
    return saved ? JSON.parse(saved) : availableWidgets.map(w => w.id)
  })

  // Debug log to check current order
  console.log('Current widget order:', widgetOrder)

  const handleToggleWidget = (widgetId) => {
    setVisibleWidgets(prev => {
      const newVisibleWidgets = prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
      localStorage.setItem('visibleWidgets', JSON.stringify(newVisibleWidgets))
      return newVisibleWidgets
    })
  }

  const handleReorderWidgets = (result) => {
    const { sourceIndex, destinationIndex, draggableId } = result
    
    const newOrder = Array.from(widgetOrder)
    const [removed] = newOrder.splice(sourceIndex, 1)
    newOrder.splice(destinationIndex, 0, draggableId)
    
    console.log('New widget order:', newOrder) // Debug log
    setWidgetOrder(newOrder)
    localStorage.setItem('widgetOrder', JSON.stringify(newOrder))
  }

  const dateRangeOptions = [
    { id: 'today', label: 'Today' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'nextWeek', label: 'Next Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'nextMonth', label: 'Next Month' }
  ]

  const calculateDateRange = (option, type) => {
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch (option) {
      case 'today':
        break
      case 'tomorrow':
        start = new Date(today.setDate(today.getDate() + 1))
        end = new Date(start)
        break
      case 'thisWeek':
        start = new Date(today.setDate(today.getDate() - today.getDay()))
        end = new Date(today.setDate(today.getDate() + 6))
        break
      case 'nextWeek':
        start = new Date(today.setDate(today.getDate() - today.getDay() + 7))
        end = new Date(today.setDate(today.getDate() + 6))
        break
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'nextMonth':
        start = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        end = new Date(today.getFullYear(), today.getMonth() + 2, 0)
        break
      default:
        break
    }

    setDateRanges(prev => ({
      ...prev,
      [type]: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      }
    }))
    setActiveRange(prev => ({ ...prev, [type]: option }))
  }

  const handleRangeChange = (type, range) => {
    console.log('Range changed:', type, range); // Debug log
    
    setActiveRange(prev => ({
      ...prev,
      [type]: range
    }));

    // Update the date range immediately
    const newRange = PREDEFINED_RANGES[range];
    if (newRange) {
      setDateRanges(prev => ({
        ...prev,
        [type]: {
          startDate: new Date(newRange.startDate),
          endDate: new Date(newRange.endDate)
        }
      }));
    }
  };

  const handleDateChange = (type, dates) => {
    setDateRanges(prev => ({
      ...prev,
      [type]: dates
    }));
  }

  // Dummy data for statistics
  const stats = [
    {
      title: 'Total Customers',
      value: '2,345',
      change: '+12%',
      trend: 'up',
      icon: PersonIcon,
    },
    {
      title: 'Total Payments',
      value: '$45,678',
      change: '+23%',
      trend: 'up',
      icon: CardStackIcon,
    },
    {
      title: 'Active Reservations',
      value: '156',
      change: '-5%',
      trend: 'down',
      icon: CalendarIcon,
    },
    {
      title: 'Available Items',
      value: '789',
      change: '+8%',
      trend: 'up',
      icon: BoxIcon,
    },
  ]

  // Quick Actions Data with "Add Payment" instead of "Process Return"
  const quickActions = [
    {
      id: 1,
      title: 'New Reservation',
      description: 'Create a new rental reservation',
      icon: <BoxIcon className="h-5 w-5 text-blue-400" />,
      iconBg: 'bg-blue-500/10',
      onClick: () => setShowAddReservation(true)
    },
    {
      id: 2,
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: <PersonIcon className="h-5 w-5 text-green-400" />,
      iconBg: 'bg-green-500/10',
      onClick: () => {
        setShowAddCustomer(true)
        setShowSidebar(true)
      }
    },
    {
      id: 3,
      title: 'Add Item',
      description: 'Add new inventory item',
      icon: <CardStackIcon className="h-5 w-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10',
      onClick: () => {
        setShowAddItem(true)
        setShowSidebar(true)
      }
    },
    {
      id: 4,
      title: 'Add Payment',
      description: 'Process new payment',
      icon: <PlusIcon className="h-5 w-5 text-emerald-400" />,
      iconBg: 'bg-emerald-500/10',
      onClick: () => navigate('/payments/new')
    }
  ]

  // System Health Metrics
  const systemMetrics = [
    {
      id: 1,
      label: 'System Status',
      value: 'Operational',
      status: 'Active',
      statusColor: 'bg-green-500/10 text-green-400'
    },
    {
      id: 2,
      label: 'Active Users',
      value: '24',
      status: 'Normal',
      statusColor: 'bg-blue-500/10 text-blue-400'
    },
    {
      id: 3,
      label: 'Pending Returns',
      value: '12',
      status: 'Warning',
      statusColor: 'bg-yellow-500/10 text-yellow-400'
    },
    {
      id: 4,
      label: 'Server Load',
      value: '28%',
      status: 'Good',
      statusColor: 'bg-green-500/10 text-green-400'
    }
  ]

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      description: 'New reservation created for Sarah Johnson',
      timestamp: '5 minutes ago',
      icon: <BoxIcon className="h-5 w-5 text-blue-400" />,
      iconBg: 'bg-blue-500/10'
    },
    {
      id: 2,
      description: 'Wedding dress returned by Emily Davis',
      timestamp: '1 hour ago',
      icon: <ArrowDownIcon className="h-5 w-5 text-green-400" />,
      iconBg: 'bg-green-500/10'
    },
    {
      id: 3,
      description: 'New customer profile created',
      timestamp: '2 hours ago',
      icon: <PersonIcon className="h-5 w-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10'
    },
    {
      id: 4,
      description: 'Inventory update: 5 new items added',
      timestamp: '3 hours ago',
      icon: <CardStackIcon className="h-5 w-5 text-yellow-400" />,
      iconBg: 'bg-yellow-500/10'
    }
  ]

  // Enhanced dummy data for upcoming pickups
  const upcomingPickups = [
    {
      id: 1,
      customerName: 'Sarah Johnson',
      items: ['Wedding Dress - Ivory Lace', 'Cathedral Veil', 'Bridal Accessories Set'],
      date: '2024-03-25',
      time: '10:00 AM',
      status: 'Confirmed',
      orderNumber: 'PU-2024-001',
      contactNumber: '+1 (555) 123-4567'
    },
    {
      id: 2,
      customerName: 'Emily Davis',
      items: ['Evening Gown - Navy Blue', 'Crystal Jewelry Set', 'Designer Clutch'],
      date: '2024-03-26',
      time: '2:00 PM',
      status: 'Pending',
      orderNumber: 'PU-2024-002',
      contactNumber: '+1 (555) 234-5678'
    },
    {
      id: 3,
      customerName: 'Maria Garcia',
      items: ['Bridal Set - White & Gold', 'Tiara', 'Wedding Shoes'],
      date: '2024-03-27',
      time: '11:30 AM',
      status: 'Confirmed',
      orderNumber: 'PU-2024-003',
      contactNumber: '+1 (555) 345-6789'
    },
    {
      id: 4,
      customerName: 'Jennifer Wilson',
      items: ['Bridesmaid Dress x3', 'Hair Accessories Set'],
      date: '2024-03-27',
      time: '3:30 PM',
      status: 'Pending',
      orderNumber: 'PU-2024-004',
      contactNumber: '+1 (555) 456-7890'
    },
    {
      id: 5,
      customerName: 'Michelle Thompson',
      items: ['Flower Girl Dress', 'Sash', 'Headpiece'],
      date: '2024-03-28',
      time: '1:00 PM',
      status: 'Confirmed',
      orderNumber: 'PU-2024-005',
      contactNumber: '+1 (555) 567-8901'
    }
  ]

  // Enhanced dummy data for upcoming returns
  const upcomingReturns = [
    {
      id: 1,
      customerName: 'Jessica Brown',
      items: ['Wedding Dress - White Silk', 'Designer Veil', 'Pearl Jewelry Set'],
      date: '2024-03-24',
      time: '4:00 PM',
      status: 'On Time',
      orderNumber: 'RT-2024-001',
      contactNumber: '+1 (555) 678-9012'
    },
    {
      id: 2,
      customerName: 'Amanda Wilson',
      items: ['Evening Gown - Red Sequin', 'Clutch Bag', 'Wrap Shawl'],
      date: '2024-03-25',
      time: '1:00 PM',
      status: 'Delayed',
      orderNumber: 'RT-2024-002',
      contactNumber: '+1 (555) 789-0123'
    },
    {
      id: 3,
      customerName: 'Laura Martinez',
      items: ['Bridal Set - Champagne', 'Crystal Crown', 'Wedding Shoes'],
      date: '2024-03-26',
      time: '3:30 PM',
      status: 'On Time',
      orderNumber: 'RT-2024-003',
      contactNumber: '+1 (555) 890-1234'
    },
    {
      id: 4,
      customerName: 'Rachel Chen',
      items: ['Designer Gown - Black', 'Statement Necklace'],
      date: '2024-03-26',
      time: '5:00 PM',
      status: 'Delayed',
      orderNumber: 'RT-2024-004',
      contactNumber: '+1 (555) 901-2345'
    },
    {
      id: 5,
      customerName: 'Sofia Rodriguez',
      items: ['Quinceañera Dress', 'Tiara', 'Bouquet'],
      date: '2024-03-27',
      time: '2:00 PM',
      status: 'On Time',
      orderNumber: 'RT-2024-005',
      contactNumber: '+1 (555) 012-3456'
    }
  ]

  // Filter pickups and returns based on date ranges
  const getFilteredData = (data, type) => {
    const range = dateRanges[type];
    if (!range?.startDate || !range?.endDate) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);
      
      // Set hours to 0 for accurate date comparison
      itemDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const filteredPickups = getFilteredData(DUMMY_DATA.pickups, 'pickup');
  const filteredReturns = getFilteredData(DUMMY_DATA.returns, 'return');

  console.log('Current date ranges:', dateRanges);
  console.log('Filtered pickups:', filteredPickups);
  console.log('Filtered returns:', filteredReturns);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'addCustomer':
        setShowAddCustomerModal(true)
        break
      case 'newPayment':
        setShowAddPaymentModal(true)
        break
      case 'addReservation':
        console.log('Reservations module coming soon')
        break
      case 'addItem':
        setShowAddItemModal(true)
        break
      default:
        break
    }
  }

  const FilterPopover = ({ type, dateRange, activeRange }) => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <MixerHorizontalIcon className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-80 rounded-lg bg-gray-800 border border-white/10 shadow-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          sideOffset={5}
          align="end"
          side="bottom"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Date Range</h3>
            
            {/* Predefined Options */}
            <div className="flex flex-wrap gap-2">
              {dateRangeOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => calculateDateRange(option.id, type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeRange === option.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Custom Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRanges(prev => ({
                    ...prev,
                    [type]: { ...prev[type], start: e.target.value }
                  }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRanges(prev => ({
                    ...prev,
                    [type]: { ...prev[type], end: e.target.value }
                  }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <Popover.Arrow className="fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )

  const handleError = (error, errorInfo) => {
    console.error('Dashboard Error:', error, errorInfo)
    // Here you could also log to an error reporting service
  }

  const handleAddCustomer = () => {
    setIsAddCustomerOpen(true)
  }

  const handleCloseAddCustomer = () => {
    setIsAddCustomerOpen(false)
  }

  const handleSubmitCustomer = (formData) => {
    console.log('New customer data:', formData)
    // TODO: Implement API call to save customer
    setIsAddCustomerOpen(false)
  }

  const orderedWidgets = widgetOrder
    .map(id => availableWidgets.find(w => w.id === id))
    .filter(Boolean)

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 to-gray-800 py-4 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
            <WidgetManager 
              widgets={orderedWidgets}
              visibleWidgets={visibleWidgets}
              onToggleWidget={handleToggleWidget}
              onReorderWidgets={handleReorderWidgets}
            />
          </ErrorBoundary>
        </div>
      </div>

      <div className="space-y-6">
        {(() => {
          const renderedWidgets = [];
          let currentRow = [];

          // Helper function to render a row of widgets
          const renderRow = () => {
            if (currentRow.length === 0) return null;
            
            return (
              <div key={currentRow.map(w => w.id).join('-')} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentRow.map(widget => (
                  <ErrorBoundary key={widget.id} FallbackComponent={ErrorFallback}>
                    {renderWidget(widget)}
                  </ErrorBoundary>
                ))}
              </div>
            );
          };

          // Helper function to render individual widget
          const renderWidget = (widget) => {
            // Create specific props for each widget type
            switch (widget.id) {
              case 'stats':
                return <StatsWidget stats={stats} />;
              case 'pickups':
                return (
                  <PickupsWidget 
                    pickups={filteredPickups}
                    dateRange={dateRanges.pickup}
                    activeRange={activeRange.pickup}
                    onRangeChange={(range) => handleRangeChange('pickup', range)}
                    onDateChange={(dates) => handleDateChange('pickup', dates)}
                    predefinedRanges={PREDEFINED_RANGES}
                  />
                );
              case 'returns':
                return (
                  <ReturnsWidget 
                    returns={filteredReturns}
                    dateRange={dateRanges.return}
                    activeRange={activeRange.return}
                    onRangeChange={(range) => handleRangeChange('return', range)}
                    onDateChange={(dates) => handleDateChange('return', dates)}
                    predefinedRanges={PREDEFINED_RANGES}
                  />
                );
              case 'activity':
                return <RecentActivityWidget activities={recentActivities} />;
              case 'quickActions':
                return <QuickActionsWidget actions={quickActions} onAction={handleQuickAction} />;
              case 'systemHealth':
                return <SystemHealthWidget metrics={systemMetrics} />;
              default:
                return null;
            }
          };

          // Process widgets in order
          widgetOrder.forEach((widgetId) => {
            if (!visibleWidgets.includes(widgetId)) return;
            
            const widget = availableWidgets.find(w => w.id === widgetId);
            if (!widget) return;

            if (widget.width === 'full') {
              if (currentRow.length > 0) {
                renderedWidgets.push(renderRow());
                currentRow = [];
              }
              renderedWidgets.push(
                <div key={`full-${widget.id}`} className="w-full">
                  <ErrorBoundary key={widget.id} FallbackComponent={ErrorFallback}>
                    {renderWidget(widget)}
                  </ErrorBoundary>
                </div>
              );
            } else {
              currentRow.push(widget);
              if (currentRow.length === 2) {
                renderedWidgets.push(renderRow());
                currentRow = [];
              }
            }
          });

          // Render any remaining widgets
          if (currentRow.length > 0) {
            renderedWidgets.push(renderRow());
          }

          return renderedWidgets;
        })()}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />
      <div className="pl-64">
        <div className="max-w-7xl mx-auto">
          <div className="py-8 px-6">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {location.pathname === '/home' ? <DashboardContent /> : <Outlet />}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 