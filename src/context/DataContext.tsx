import React, { createContext, useContext, useState } from 'react';
import type { User, Attendance, LeaveRequest, PayrollRecord, Notification, AnalyticsData, PendingEmployee } from '../types';
import { mockUsers, mockAttendance, mockLeaves, mockPayroll, mockNotifications } from '../data/mockData';

interface DataContextType {
  employees: User[];
  pendingEmployees: PendingEmployee[];
  attendance: Attendance[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  notifications: Notification[];
  analytics: AnalyticsData;

  addAttendance: (record: Attendance) => void;
  updateAttendance: (id: string, data: Partial<Attendance>) => void;

  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status'], comment?: string) => void;

  updateEmployee: (id: string, data: Partial<User>) => void;
  addEmployee: (user: User) => void;

  addPendingEmployee: (employee: PendingEmployee) => void;
  removePendingEmployee: (id: string) => void;

  addPayrollRecord: (record: PayrollRecord) => void;

  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<User[]>(mockUsers);
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(mockPayroll);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addAttendance = (record: Attendance) => {
    setAttendance(prev => [...prev, record]);
  };

  const updateAttendance = (id: string, data: Partial<Attendance>) => {
    setAttendance(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const addLeaveRequest = (request: LeaveRequest) => {
    setLeaves(prev => [...prev, request]);
    addNotification({
      id: `NOTIF${Date.now()}`,
      userId: 'EMP001', // Notify Admin
      title: 'New Leave Request',
      message: `Leave request from ${employees.find(e => e.id === request.userId)?.name}`,
      type: 'info',
      date: new Date().toISOString().split('T')[0],
      read: false
    });
  };

  const updateLeaveStatus = (id: string, status: LeaveRequest['status'], comment?: string) => {
    setLeaves(prev => prev.map(item =>
      item.id === id ? { ...item, status, adminComment: comment || item.adminComment } : item
    ));
   
    const leave = leaves.find(l => l.id === id);
    if (leave) {
      addNotification({
        id: `NOTIF${Date.now()}`,
        userId: leave.userId,
        title: `Leave ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Your leave request has been ${status}. ${comment ? `Comment: ${comment}` : ''}`,
        type: status === 'approved' ? 'success' : 'error',
        date: new Date().toISOString().split('T')[0],
        read: false
      });
    }
  };

  const updateEmployee = (id: string, data: Partial<User>) => {
    setEmployees(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    
    // Also update mockUsers for AuthContext visibility
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data };
    }
  };

  const addEmployee = (user: User) => {
    // IMPORTANT: Push to the shared "database" array so AuthContext sees it
    mockUsers.push(user);
   
    // Update local state for UI
    setEmployees(prev => [...prev, user]);
  };

  const addPendingEmployee = (employee: PendingEmployee) => {
    setPendingEmployees(prev => [...prev, employee]);
    addNotification({
      id: `NOTIF${Date.now()}`,
      userId: 'EMP001', // Notify Admin
      title: 'New Join Request',
      message: `${employee.name} has requested to join as an Employee.`,
      type: 'info',
      date: new Date().toISOString().split('T')[0],
      read: false
    });
  };

  const removePendingEmployee = (id: string) => {
    setPendingEmployees(prev => prev.filter(p => p.id !== id));
  };

  const addPayrollRecord = (record: PayrollRecord) => {
    setPayroll(prev => [...prev, record]);
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const analytics: AnalyticsData = {
    attendanceRate: 95,
    leaveRate: 5,
    totalPayroll: payroll.reduce((acc, curr) => acc + curr.netSalary, 0),
    employeeCount: employees.length,
    departmentDistribution: [
      { name: 'Engineering', count: employees.filter(e => e.department === 'Engineering').length },
      { name: 'HR', count: employees.filter(e => e.department === 'Human Resources').length },
      { name: 'Design', count: employees.filter(e => e.department === 'Design').length },
      { name: 'Management', count: employees.filter(e => e.department === 'Management').length }
    ],
    attendanceTrend: [
      { date: 'Mon', present: 45, absent: 2 },
      { date: 'Tue', present: 46, absent: 1 },
      { date: 'Wed', present: 44, absent: 3 },
      { date: 'Thu', present: 47, absent: 0 },
      { date: 'Fri', present: 45, absent: 2 }
    ]
  };

  return (
    <DataContext.Provider value={{
      employees,
      pendingEmployees,
      attendance,
      leaves,
      payroll,
      notifications,
      analytics,
      addAttendance,
      updateAttendance,
      addLeaveRequest,
      updateLeaveStatus,
      updateEmployee,
      addEmployee,
      addPendingEmployee,
      removePendingEmployee,
      addPayrollRecord,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
