'use client';

import MaterialSidebar from './MaterialSidebar';
import { useState } from 'react';

interface MaterialLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function MaterialLayout({ children, title, subtitle }: MaterialLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <MaterialSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title || 'Dashboard'}
            </h1>
            {subtitle && (
              <p className="text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🔔</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}