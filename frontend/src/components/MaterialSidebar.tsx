'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, hasRole, clearAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function MaterialSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', color: 'bg-blue-500' },
    { name: 'My Posts', href: '/dashboard/posts', icon: '📝', color: 'bg-green-500' },
    { name: 'Create Post', href: '/dashboard/posts/create', icon: '✍️', color: 'bg-purple-500' },
    { name: 'Profile', href: '/dashboard/profile', icon: '👤', color: 'bg-indigo-500' },
    ...(hasRole('admin') ? [
      { name: 'All Posts', href: '/dashboard/admin/posts', icon: '📚', color: 'bg-orange-500' },
      { name: 'Users', href: '/dashboard/admin/users', icon: '👥', color: 'bg-red-500' },
      { name: 'Comments', href: '/dashboard/admin/comments', icon: '💬', color: 'bg-yellow-500' },
      { name: 'Contacts', href: '/dashboard/admin/contacts', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ] : [])
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl h-screen w-72 fixed left-0 top-0 z-50">
      {/* Header */}
      <div className="flex items-center justify-center h-20 border-b border-slate-700 bg-slate-800/50">
        <Link href="/" className="text-2xl font-bold text-white flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span>Blog Platform</span>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-6 border-b border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold">{user?.username}</p>
              <p className="text-blue-100 text-sm capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-105'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                pathname === item.href ? 'bg-white/20' : item.color
              }`}>
                <span className={pathname === item.href ? 'text-white' : 'text-white'}>{item.icon}</span>
              </div>
              {item.name}
              {pathname === item.href && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-500/30">
            <span>🚪</span>
          </div>
          Logout
        </button>
      </div>
    </div>
  );
}