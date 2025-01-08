import { ClockIcon } from '@radix-ui/react-icons'

const RecentActivityWidget = ({ activities }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <ClockIcon className="h-5 w-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>
      </div>
      <div className="space-y-6">
        {activities?.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 bg-white/5 rounded-lg"
          >
            <div className={`p-2 rounded-lg ${activity.iconBg}`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-white">{activity.description}</p>
              <p className="text-sm text-gray-400">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivityWidget 