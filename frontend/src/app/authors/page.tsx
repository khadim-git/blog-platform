'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usersAPI } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const response = await fetch('http://localhost:8000/users/authors');
      const authors = await response.json();
      setAuthors(authors);
    } catch (error) {
      console.error('Failed to load authors');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Authors</h3>
            <p className="text-gray-600">Getting author information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Authors</h1>
            <p className="text-gray-600 text-lg">Meet the talented writers behind our content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author: any) => (
              <Link key={author.id} href={`/authors/${author.username}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
                  <div className="text-center">
                    {author.avatar_url ? (
                      <img 
                        src={author.avatar_url} 
                        alt={author.username}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        {author.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{author.username}</h3>
                    <p className="text-blue-600 text-sm font-medium mb-3 capitalize">{author.role}</p>
                    <p className="text-gray-600 text-sm">Click to view all posts by this author</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {authors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No authors found.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}