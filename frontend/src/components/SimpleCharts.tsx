'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">Loading chart...</div>
});

export default function SimpleCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const lineOptions = {
    chart: {
      type: 'line' as const,
      height: 300
    },
    colors: ['#3B82F6', '#10B981'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    }
  };

  const lineSeries = [
    { name: 'Posts', data: [10, 15, 8, 22, 18, 25] },
    { name: 'Users', data: [50, 65, 45, 80, 70, 95] }
  ];

  const donutOptions = {
    chart: { type: 'donut' as const },
    labels: ['Technology', 'Lifestyle', 'Travel', 'Food'],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  };

  const donutSeries = [25, 18, 15, 12];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">1,250</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Total Posts</h3>
          <p className="text-2xl font-bold text-green-600">89</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Comments</h3>
          <p className="text-2xl font-bold text-yellow-600">456</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">12</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
          <Chart
            options={lineOptions}
            series={lineSeries}
            type="line"
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <Chart
            options={donutOptions}
            series={donutSeries}
            type="donut"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}