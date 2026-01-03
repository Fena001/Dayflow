import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { BarChart, PieChart, Activity, Users } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { analytics } = useData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics & Reports</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Attendance Rate</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{analytics.attendanceRate}%</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Leave Rate</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{analytics.leaveRate}%</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Payroll</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">${analytics.totalPayroll.toLocaleString()}</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{analytics.employeeCount}</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Attendance Trend (Last 5 Days)">
          <div className="h-64 flex items-end justify-between space-x-2 px-4">
            {analytics.attendanceTrend.map((item) => (
              <div key={item.date} className="flex flex-col items-center w-full">
                <div className="w-full bg-gray-100 rounded-t-md relative h-48 flex items-end">
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
                    style={{ height: `${(item.present / (item.present + item.absent)) * 100}%` }}
                  ></div>
                </div>
                <span className="mt-2 text-sm text-gray-600">{item.date}</span>
                <span className="text-xs text-gray-500">{item.present} Present</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Department Distribution">
          <div className="space-y-4">
            {analytics.departmentDistribution.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <span>{dept.name}</span>
                  <span>{dept.count} Employees</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${(dept.count / analytics.employeeCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
