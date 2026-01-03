import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Bell, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Notifications: React.FC = () => {
  const { notifications, markNotificationRead } = useData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>

      <Card>
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <li className="py-5 text-center text-gray-500">No notifications</li>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id} className={`py-5 ${notification.read ? 'opacity-60' : ''}`}>
                  <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <Badge variant={
                        notification.type === 'success' ? 'success' :
                        notification.type === 'error' ? 'danger' :
                        notification.type === 'warning' ? 'warning' : 'info'
                      }>
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markNotificationRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Check className="h-4 w-4 mr-1" /> Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </Card>
    </div>
  );
};
