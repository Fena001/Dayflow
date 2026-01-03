import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import type { LeaveType } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

export const Leaves: React.FC = () => {
  const { user } = useAuth();
  const { leaves, employees, addLeaveRequest, updateLeaveStatus } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'paid' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });
 
  // Admin Action State
  const [adminComment, setAdminComment] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);

  const myLeaves = leaves.filter(l => l.userId === user?.id).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const allLeaves = leaves.sort((a, b) => b.startDate.localeCompare(a.startDate));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addLeaveRequest({
      id: `LEAVE${Date.now()}`,
      userId: user.id,
      status: 'pending',
      ...formData
    });
    setShowForm(false);
    setFormData({ type: 'paid', startDate: '', endDate: '', reason: '' });
  };

  const handleAdminAction = (id: string, status: 'approved' | 'rejected') => {
    updateLeaveStatus(id, status, adminComment);
    setAdminComment('');
    setSelectedLeaveId(null);
  };

  const renderEmployeeView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Leaves</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Apply Leave'}
        </Button>
      </div>

      {showForm && (
        <Card title="Apply for Leave">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveType })}
                >
                  <option value="paid">Paid Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              <Input
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <Input
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <Input
              label="Reason / Remarks"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
            <div className="flex justify-end">
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Leave History">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Comment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{leave.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {leave.startDate} to {leave.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      leave.status === 'approved' ? 'success' :
                      leave.status === 'rejected' ? 'danger' : 'warning'
                    }>
                      {leave.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.adminComment || '-'}</td>
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
      <h1 className="text-2xl font-semibold text-gray-900">Leave Management</h1>
     
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employees.find(e => e.id === leave.userId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{leave.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {leave.startDate} to {leave.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      leave.status === 'approved' ? 'success' :
                      leave.status === 'rejected' ? 'danger' : 'warning'
                    }>
                      {leave.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {leave.status === 'pending' ? (
                      <div className="flex flex-col space-y-2">
                        {selectedLeaveId === leave.id ? (
                          <div className="flex flex-col space-y-2">
                            <Input
                              placeholder="Comment..."
                              value={adminComment}
                              onChange={(e) => setAdminComment(e.target.value)}
                              className="h-8 text-xs"
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" variant="success" onClick={() => handleAdminAction(leave.id, 'approved')}>
                                Confirm
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setSelectedLeaveId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => setSelectedLeaveId(leave.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => { setSelectedLeaveId(leave.id); setAdminComment('Rejected'); }} // Quick reject or open comment
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Processed</span>
                    )}
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
