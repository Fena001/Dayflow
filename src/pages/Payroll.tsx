import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const Payroll: React.FC = () => {
  const { user } = useAuth();
  const { payroll } = useData();

  const myPayroll = payroll.filter(p => p.userId === user?.id).sort((a, b) => b.month.localeCompare(a.month));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">My Payroll</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myPayroll.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.basicSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+${record.allowances.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-${record.deductions.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${record.netSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={record.status === 'paid' ? 'success' : 'warning'}>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.paymentDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
