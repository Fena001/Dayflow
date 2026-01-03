export type Role = 'admin' | 'employee';

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNumber: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: 'resume' | 'other';
  uploadDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  position?: string;
  department?: string;
  joinDate?: string;
  phone?: string;
  address?: string;
  salary?: number;
 
  // New fields
  companyName?: string;
  managerName?: string;
  location?: string;
  dob?: string;
  nationality?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  bankDetails?: BankDetails;
  documents?: Document[];
  isTempPassword?: boolean; // For forced password change
  password?: string; // For mock auth only
}

export interface PendingEmployee {
  id: string;
  name: string;
  email: string;
  role: 'employee';
  requestDate: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave';

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours?: number;
}

export type LeaveType = 'paid' | 'sick' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  adminComment?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  userId: string; // 'all' for system-wide
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
}

export interface AnalyticsData {
  attendanceRate: number;
  leaveRate: number;
  totalPayroll: number;
  employeeCount: number;
  departmentDistribution: { name: string; count: number }[];
  attendanceTrend: { date: string; present: number; absent: number }[];
}
