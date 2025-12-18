'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MudLayout from '@/components/MudLayout';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded flex items-center justify-center">Loading Chart...</div>
});

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;

  const usersChartOptions = {
    chart: { type: 'area' as const, height: 300, toolbar: { show: false } },
    colors: ['#3B82F6'],
    fill: { type: 'gradient' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] }
  };
  const usersChartSeries = [{ name: 'Total Users', data: [120, 180, 250, 320, 450, 580, 720, 890, 1050, 1250] }];

  const viewsChartOptions = {
    chart: { type: 'line' as const, height: 300, toolbar: { show: false } },
    colors: ['#10B981'],
    stroke: { curve: 'smooth' as const, width: 3 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] }
  };
  const viewsChartSeries = [{ name: 'Total Views', data: [1200, 1800, 2100, 2800, 3200, 3900, 4500, 5200, 5800, 6500] }];

  const commentsChartOptions = {
    chart: { type: 'bar' as const, height: 300, toolbar: { show: false } },
    colors: ['#F59E0B'],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] }
  };
  const commentsChartSeries = [{ name: 'Comments', data: [45, 68, 52, 89, 76, 95, 112, 98, 134, 156] }];

  return (
    <ProtectedRoute requiredRole="admin">
      <MudLayout title="Admin Dashboard" subtitle="Analytics & Management">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">1,250</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600">Total Views</h3>
              <p className="text-2xl font-bold text-green-600">6,500</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600">Total Comments</h3>
              <p className="text-2xl font-bold text-yellow-600">1,156</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-600">Total Posts</h3>
              <p className="text-2xl font-bold text-purple-600">89</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Total Users Growth</h3>
              <Chart
                options={usersChartOptions}
                series={usersChartSeries}
                type="area"
                height={300}
              />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Total Views Trend</h3>
              <Chart
                options={viewsChartOptions}
                series={viewsChartSeries}
                type="line"
                height={300}
              />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Comments Analytics</h3>
              <Chart
                options={commentsChartOptions}
                series={commentsChartSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <a href="/dashboard/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">Users</h3>
              <p className="text-gray-600">Manage users</p>
            </a>
            <a href="/dashboard/admin/posts" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">Posts</h3>
              <p className="text-gray-600">Manage posts</p>
            </a>
            <a href="/dashboard/admin/categories" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">Categories</h3>
              <p className="text-gray-600">Manage categories</p>
            </a>
            <a href="/dashboard/admin/tags" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold">Tags</h3>
              <p className="text-gray-600">Manage tags</p>
            </a>
          </div>
        </div>
      </MudLayout>
    </ProtectedRoute>
  );
}