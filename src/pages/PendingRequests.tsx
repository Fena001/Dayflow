import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserPlus, Check, X } from 'lucide-react';
import type { User, PendingEmployee } from '../types';

export const PendingRequests: React.FC = () => {
  const { pendingEmployees, removePendingEmployee, addEmployee } = useData();
  const [selectedRequest, setSelectedRequest] = useState<PendingEmployee | null>(null);
  
  // Form state for approval
  const [approvalData, setApprovalData] = useState({
    loginId: '',
    password: '',
    confirmPassword: '',
    department: '',
    position: '',
    salary: 0
  });

  const handleSelectRequest = (request: PendingEmployee) => {
    setSelectedRequest(request);
    
    // Auto-generate credentials
    const generatedId = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedPassword = Math.random().toString(36).slice(-8);
    
    setApprovalData({
      loginId: generatedId,
      password: generatedPassword,
      confirmPassword: generatedPassword,
      department: 'Engineering', // Default
      position: 'Junior Developer', // Default
      salary: 50000 // Default
    });
  };

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const newEmployee: User = {
      id: approvalData.loginId,
      name: selectedRequest.name,
      email: selectedRequest.email,
      role: 'employee',
      position: approvalData.position,
      department: approvalData.department,
      joinDate: new Date().toISOString().split('T')[0],
      salary: Number(approvalData.salary),
      password: approvalData.password,
      isTempPassword: true, // Force password change on first login
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.name)}&background=random`
    };

    addEmployee(newEmployee);
    removePendingEmployee(selectedRequest.id);
    setSelectedRequest(null);
    alert(`Employee Approved!\nLogin ID: ${newEmployee.id}\nPassword: ${newEmployee.password}`);
  };

  const handleReject = (id: string) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      removePendingEmployee(id);
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Pending Join Requests</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Requests */}
        <div className="lg:col-span-1 space-y-4">
          {pendingEmployees.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-4">No pending requests.</p>
            </Card>
          ) : (
            pendingEmployees.map((req) => (
              <div 
                key={req.id} 
                onClick={() => handleSelectRequest(req)}
                className={`bg-white p-4 rounded-lg shadow cursor-pointer border-l-4 transition-all ${
                  selectedRequest?.id === req.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{req.name}</h3>
                    <p className="text-sm text-gray-500">{req.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Requested: {req.requestDate}</p>
                  </div>
                  <UserPlus className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Approval Form */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <Card title={`Approve Request: ${selectedRequest.name}`}>
              <form onSubmit={handleApprove} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Auto-Generated Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Login ID"
                      value={approvalData.loginId}
                      onChange={(e) => setApprovalData({...approvalData, loginId: e.target.value})}
                      required
                    />
                    <Input
                      label="Temporary Password"
                      value={approvalData.password}
                      onChange={(e) => setApprovalData({...approvalData, password: e.target.value})}
                      required
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    * Share these credentials with the employee. They will be asked to change password on first login.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    value={approvalData.department}
                    onChange={(e) => setApprovalData({...approvalData, department: e.target.value})}
                    required
                  />
                  <Input
                    label="Position"
                    value={approvalData.position}
                    onChange={(e) => setApprovalData({...approvalData, position: e.target.value})}
                    required
                  />
                  <Input
                    label="Salary"
                    type="number"
                    value={approvalData.salary}
                    onChange={(e) => setApprovalData({...approvalData, salary: Number(e.target.value)})}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="danger" 
                    onClick={() => handleReject(selectedRequest.id)}
                  >
                    <X className="h-4 w-4 mr-2" /> Reject Request
                  </Button>
                  <Button type="submit" variant="success">
                    <Check className="h-4 w-4 mr-2" /> Approve & Create Account
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12">
              <div className="text-center">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No request selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a pending request from the list to review.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
