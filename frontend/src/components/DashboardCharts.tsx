'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalCategories: number;
  monthlyPosts: number[];
  monthlyUsers: number[];
  categoryData: { name: string; count: number }[];
  recentActivity: { date: string; posts: number; users: number }[];
}

export default function DashboardCharts() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1250,
    totalPosts: 89,
    totalComments: 456,
    totalCategories: 12,
    monthlyPosts: [10, 15, 8, 22, 18, 25, 30, 28, 35, 40, 32, 45],
    monthlyUsers: [50, 65, 45, 80, 70, 95, 110, 105, 125, 140, 130, 160],
    categoryData: [
      { name: 'Technology', count: 25 },
      { name: 'Lifestyle', count: 18 },
      { name: 'Travel', count: 15 },
      { name: 'Food', count: 12 },
      { name: 'Health', count: 10 },
      { name: 'Business', count: 9 }
    ],
    recentActivity: [
      { date: '2024-01-01', posts: 5, users: 12 },
      { date: '2024-01-02', posts: 8, users: 15 },
      { date: '2024-01-03', posts: 6, users: 10 },
      { date: '2024-01-04', posts: 12, users: 18 },
      { date: '2024-01-05', posts: 9, users: 14 },
      { date: '2024-01-06', posts: 15, users: 22 },
      { date: '2024-01-07', posts: 11, users: 16 }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Delay API call to ensure charts render with mock data first
    setTimeout(fetchDashboardStats, 1000);
  }, []);

  const lineChartOptions = {
    chart: {
      type: 'line' as const,
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#3B82F6', '#10B981'],
    stroke: { curve: 'smooth' as const, width: 3 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: { position: 'top' as const }
  };

  const lineChartSeries = [
    { name: 'Posts', data: stats.monthlyPosts },
    { name: 'Users', data: stats.monthlyUsers }
  ];

  const donutChartOptions = {
    chart: { type: 'donut' as const },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    labels: stats.categoryData.map(item => item.name),
    legend: { position: 'bottom' as const }
  };

  const donutChartSeries = stats.categoryData.map(item => item.count);

  const barChartOptions = {
    chart: {
      type: 'bar' as const,
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#3B82F6', '#10B981'],
    xaxis: {
      categories: stats.recentActivity.map(item => 
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
    },
    legend: { position: 'top' as const }
  };

  const barChartSeries = [
    { name: 'Posts', data: stats.recentActivity.map(item => item.posts) },
    { name: 'Users', data: stats.recentActivity.map(item => item.users) }
  ];

  const areaChartOptions = {
    chart: {
      type: 'area' as const,
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    },
    stroke: { curve: 'smooth' as const },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  const areaChartSeries = [{ name: 'Monthly Growth', data: stats.monthlyUsers }];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Posts</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalPosts}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Comments</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalComments}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Categories</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalCategories}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={350}
          />
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts by Category</h3>
          <Chart
            options={donutChartOptions}
            series={donutChartSeries}
            type="donut"
            height={350}
          />
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <Chart
            options={areaChartOptions}
            series={areaChartSeries}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}