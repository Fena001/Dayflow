import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard,
  User,
  Calendar,
  Clock,
  DollarSign,
  LogOut,
  Menu,
  X,
  BarChart,
  Bell,
  UserPlus
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications, pendingEmployees } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => (n.userId === user?.id || n.userId === 'all') && !n.read).length;
  const pendingCount = pendingEmployees.length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/employee',
      icon: LayoutDashboard
    },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Attendance', href: '/attendance', icon: Clock },
    { name: 'Leaves', href: '/leaves', icon: Calendar },
    { name: 'Payroll', href: '/payroll', icon: DollarSign },
  ];

  if (user?.role === 'admin') {
    navigation.push(
      { name: 'Analytics', href: '/analytics', icon: BarChart },
      { name: 'Requests', href: '/requests', icon: UserPlus },
      { name: 'Notifications', href: '/notifications', icon: Bell }
    );
  } else {
    navigation.push(
      { name: 'Notifications', href: '/notifications', icon: Bell }
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-800 text-white">
        <div className="flex items-center justify-center h-16 bg-slate-900 px-4">
          <h1 className="text-xl font-bold tracking-wider">HR SYSTEM</h1>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors relative',
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  {item.name}
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <span className="absolute right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  {item.name === 'Requests' && pendingCount > 0 && (
                    <span className="absolute right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex bg-slate-900 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-100">
                {user?.avatar ? (
                  <img className="h-full w-full object-cover" src={user.avatar} alt="" />
                ) : (
                  <User className="h-full w-full p-1 text-gray-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs font-medium text-slate-300 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-slate-800 text-white h-16 flex items-center justify-between px-4 shadow-md">
        <h1 className="text-lg font-bold">HR SYSTEM</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-800 pt-16">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium text-white relative',
                  location.pathname === item.href ? 'bg-slate-900' : 'hover:bg-slate-700'
                )}
              >
                <div className="flex items-center">
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  {item.name === 'Requests' && pendingCount > 0 && (
                    <span className="ml-auto bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700"
            >
              <div className="flex items-center">
                <LogOut className="mr-4 h-6 w-6" />
                Logout
              </div>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 pt-16 md:pt-0">
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};
