'use client';

import { useEffect, useState } from 'react';

export default function TestChart() {
  const [Chart, setChart] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadChart = async () => {
      try {
        const ApexCharts = await import('react-apexcharts');
        setChart(() => ApexCharts.default);
      } catch (err) {
        setError(`Error loading ApexCharts: ${err}`);
        console.error('Error loading ApexCharts:', err);
      }
    };

    loadChart();
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!Chart) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        Loading ApexCharts...
      </div>
    );
  }

  const options = {
    chart: {
      type: 'line' as const,
      height: 300
    },
    series: [{
      name: 'Test Data',
      data: [10, 20, 15, 25, 30, 35]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Test Chart</h3>
      <Chart
        options={options}
        series={options.series}
        type="line"
        height={300}
      />
    </div>
  );
}