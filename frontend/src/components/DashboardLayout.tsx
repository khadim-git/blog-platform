'use client';

import Sidebar from './Sidebar';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title || 'Dashboard'}</h1>
          <p className="text-sm text-gray-600 mt-1">Write and publish your blog post</p>
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}