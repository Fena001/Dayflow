import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { User, Clock, Calendar, DollarSign, LogOut, Bell, AlertCircle } from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { attendance, leaves, payroll, notifications } = useData();
  const navigate = useNavigate();

  const myAttendance = attendance.filter(a => a.userId === user?.id);
  const myLeaves = leaves.filter(l => l.userId === user?.id);
  const myPayroll = payroll.filter(p => p.userId === user?.id);
  const myNotifications = notifications.filter(n => n.userId === user?.id || n.userId === 'all');

  const todayAttendance = myAttendance.find(a => a.date === new Date().toISOString().split('T')[0]);
  const pendingLeaves = myLeaves.filter(l => l.status === 'pending').length;
  const lastSalary = myPayroll[myPayroll.length - 1];
  const unreadNotifications = myNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name}</h1>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
      </div>

      {/* Alerts Section */}
      {unreadNotifications > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You have {unreadNotifications} unread notifications.
                <Link to="/notifications" className="font-medium underline ml-2 hover:text-blue-600">
                  View all
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Profile Card */}
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Profile Status</dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-semibold text-gray-900">Active</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/profile" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View Profile &rarr;
            </Link>
          </div>
        </Card>

        {/* Attendance Card */}
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Today's Status</dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-semibold text-gray-900">
                    {todayAttendance ? 'Checked In' : 'Not Checked In'}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/attendance" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Manage Attendance &rarr;
            </Link>
          </div>
        </Card>

        {/* Leaves Card */}
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Leave Requests</dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-semibold text-gray-900">{pendingLeaves} Pending</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/leaves" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Apply Leave &rarr;
            </Link>
          </div>
        </Card>

        {/* Payroll Card */}
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Last Salary</dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-semibold text-gray-900">
                    ${lastSalary ? lastSalary.netSalary.toLocaleString() : 'N/A'}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/payroll" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View Payslips &rarr;
            </Link>
          </div>
        </Card>

        {/* Logout Card */}
        <Card className="bg-white sm:col-span-2 lg:col-span-1 cursor-pointer hover:bg-gray-50" onClick={handleLogout}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <LogOut className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Session</dt>
                <dd className="flex items-baseline">
                  <div className="text-lg font-semibold text-gray-900">Logout</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-red-600">
              Sign out securely &rarr;
            </span>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="flow-root">
          <ul className="-mb-8">
            {myNotifications.slice(0, 3).map((notif, idx) => (
              <li key={notif.id}>
                <div className="relative pb-8">
                  {idx !== 2 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        notif.type === 'success' ? 'bg-green-500' :
                        notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        <Bell className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {notif.message}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={notif.date}>{notif.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {myNotifications.length === 0 && (
              <li className="py-4 text-center text-gray-500">No recent activity</li>
            )}
          </ul>
        </div>
      </Card>
    </div>
  );
};
