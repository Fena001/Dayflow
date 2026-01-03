import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ChangePassword } from './pages/ChangePassword';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { Attendance } from './pages/Attendance';
import { Leaves } from './pages/Leaves';
import { Payroll } from './pages/Payroll';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { PendingRequests } from './pages/PendingRequests';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                   <EmployeeDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/employee" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Layout>
                  <EmployeeDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/profile/:employeeId" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/attendance" element={
              <ProtectedRoute>
                <Layout>
                  <Attendance />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/leaves" element={
              <ProtectedRoute>
                <Layout>
                  <Leaves />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/payroll" element={
              <ProtectedRoute>
                <Layout>
                  <Payroll />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/requests" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <PendingRequests />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
