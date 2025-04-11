import React from 'react'

export const NotificationsSetting = ({darkMode, notificationSettings, handleNotificationChange}) => {
  return (
    <div className="p-6">
    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      Notification Preferences
    </h2>

    <div className="space-y-6">
      {Object.entries({
        emailNotifications: {
          title: "Email Notifications",
          description: "Receive daily updates and important announcements via email"
        },
        pushNotifications: {
          title: "Push Notifications",
          description: "Receive alerts on your device for critical updates"
        },
        taskReminders: {
          title: "Task Reminders",
          description: "Get reminded about upcoming and overdue tasks"
        },
        teamUpdates: {
          title: "Team Updates",
          description: "Receive notifications when team members make changes"
        },
        projectChanges: {
          title: "Project Changes",
          description: "Get notified about project updates and milestones"
        }
      }).map(([key, { title, description }]) => (
        <div key={key} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-200`}>
          <div>
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>{title}</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
          </div>
          <div className="flex items-center">
            <button
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${notificationSettings[key] ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
              onClick={() => handleNotificationChange(key)}
              role="switch"
              aria-checked={notificationSettings[key]}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${notificationSettings[key] ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}
