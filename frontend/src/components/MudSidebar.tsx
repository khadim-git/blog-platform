'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, hasRole, clearAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function MudSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      // Wait a bit for token to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        console.log('Token check:', token ? 'EXISTS' : 'NOT FOUND');
        if (token) {
          console.log('Making API call to /users/me');
          const response = await fetch('http://localhost:8000/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Response status:', response.status);
          if (response.ok) {
            const userData = await response.json();
            console.log('API Response:', userData);
            console.log('Avatar URL:', userData.avatar_url);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            console.log('API failed, using localStorage');
            setUser(getUser());
          }
        } else {
          console.log('No token, using localStorage');
          setUser(getUser());
        }
      } catch (error) {
        setUser(getUser());
      }
    };
    
    loadUserData();
    
    // Retry after 1 second if no token initially
    const retryTimer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        loadUserData();
      }
    }, 1000);
    
    return () => clearTimeout(retryTimer);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { name: 'Posts', href: '/dashboard/posts', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Write Post', href: '/dashboard/posts/create', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ...(hasRole('admin') ? [
      { name: 'All Posts', href: '/dashboard/admin/posts', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { name: 'Users', href: '/dashboard/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
      { name: 'Categories', href: '/dashboard/admin/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
      { name: 'Tags', href: '/dashboard/admin/tags', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
      { name: 'Comments', href: '/dashboard/admin/comments', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
      { name: 'Contacts', href: '/dashboard/admin/contacts', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ] : [])
  ];
//  console.log('User in Sidebar:', user);
  return (
    <div className="bg-white shadow-xl h-screen w-64 fixed left-0 top-0 z-50 border-r border-gray-100">

      {/* User Card */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <svg className={`mr-3 h-5 w-5 ${pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-3 right-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group"
        >
          <svg className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}