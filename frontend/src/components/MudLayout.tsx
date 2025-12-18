'use client';

import MudSidebar from './MudSidebar';

interface MudLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function MudLayout({ children, title, subtitle }: MudLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <MudSidebar />
      
      <div className="flex-1 ml-64">


        {/* Content */}
        <main className="p-8 w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{title || 'Dashboard'}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}