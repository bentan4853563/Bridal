import { 
  CalendarIcon, 
  ClockIcon,
  ArrowDownIcon 
} from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'

const ReturnsWidget = ({ 
  returns, 
  dateRange, 
  activeRange, 
  onRangeChange, 
  onDateChange,
  predefinedRanges 
}) => {
  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Upcoming Returns</h2>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="px-3 py-1 text-sm rounded-full bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                {activeRange}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="w-48 rounded-lg bg-gray-800 border border-white/10 shadow-xl p-2"
                sideOffset={5}
                align="end"
                side="bottom"
              >
                <div className="space-y-1">
                  {Object.keys(predefinedRanges).map(range => (
                    <button
                      key={range}
                      onClick={() => {
                        onRangeChange(range);
                        // Close the popover after selection
                        const closeEvent = new Event('click');
                        document.dispatchEvent(closeEvent);
                      }}
                      className={`w-full px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                        activeRange === range 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
        
        <div className="space-y-4">
          {returns.map(returnItem => (
            <div 
              key={returnItem.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5"
            >
              <div>
                <h3 className="font-medium text-white">{returnItem.customerName}</h3>
                <p className="text-sm text-gray-400">{returnItem.date}</p>
                <div className="mt-1">
                  {returnItem.items.map(item => (
                    <span key={item.id} className="inline-block text-xs text-gray-400 mr-2">
                      {item.name} {item.size ? `(${item.size})` : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">{returnItem.items.length} items</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  returnItem.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                  returnItem.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {returnItem.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReturnsWidget; 