import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, Plane } from 'lucide-react';
import { Input } from '../components/ui/Input';

export const Attendance: React.FC = () => {
  const { user } = useAuth();
  const { attendance, employees, addAttendance, updateAttendance } = useData();
 
  // Admin Filters
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];
 
  // For Employee View
  const myAttendance = attendance.filter(a => a.userId === user?.id).sort((a, b) => b.date.localeCompare(a.date));
  const todayRecord = myAttendance.find(a => a.date === today);

  // For Admin View
  const filteredAttendance = attendance.filter(a => {
    if (selectedEmployee !== 'all' && a.userId !== selectedEmployee) return false;
    if (selectedDate && a.date !== selectedDate) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const handleCheckIn = () => {
    if (!user) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
   
    addAttendance({
      id: `ATT${Date.now()}`,
      userId: user.id,
      date: today,
      checkIn: time,
      status: 'present',
    });
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
   
    // Calculate work hours (simplified)
    const [inHour, inMin] = todayRecord.checkIn!.split(':').map(Number);
    const [outHour, outMin] = time.split(':').map(Number);
    const hours = (outHour + outMin/60) - (inHour + inMin/60);

    updateAttendance(todayRecord.id, {
      checkOut: time,
      workHours: Number(hours.toFixed(2))
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <div className="h-3 w-3 rounded-full bg-green-500" title="Present" />;
     
      case 'leave':
        return (
          <span title="On Leave">
            <Plane className="h-4 w-4 text-blue-500" />
          </span>
        );
       
      case 'absent':
        return <div className="h-3 w-3 rounded-full bg-yellow-500" title="Absent" />;
       
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-300" />;
    }
  };

  const renderEmployeeView = () => (
    <div className="space-y-6">
      <Card title="Today's Action">
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="text-4xl font-bold text-gray-900">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <p className="text-gray-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
         
          <div className="flex space-x-4">
            {!todayRecord ? (
              <Button size="lg" variant="success" onClick={handleCheckIn}>
                <Clock className="mr-2 h-5 w-5" /> Check In
              </Button>
            ) : !todayRecord.checkOut ? (
              <Button size="lg" variant="danger" onClick={handleCheckOut}>
                <Clock className="mr-2 h-5 w-5" /> Check Out
              </Button>
            ) : (
              <div className="text-green-600 font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5" /> Completed for today
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title="My Attendance History">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myAttendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.workHours ? `${record.workHours} hrs` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                    {getStatusIcon(record.status)}
                    <span className="capitalize text-sm text-gray-700">{record.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-6">
      <Card title="Attendance Management">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Employee</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="all">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Input
              type="date"
              label="Filter by Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => { setSelectedEmployee('all'); setSelectedDate(''); }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employees.find(e => e.id === record.userId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                    {getStatusIcon(record.status)}
                    <span className="capitalize text-sm text-gray-700">{record.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return user?.role === 'admin' ? renderAdminView() : renderEmployeeView();
};
