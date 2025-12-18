'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import MudLayout from '../../../components/MudLayout';
import { postsAPI } from '../../../lib/api';
import { hasRole } from '../../../lib/auth';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = hasRole('admin') ? await postsAPI.getAllPosts() : await postsAPI.getMyPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts');
    }
    setLoading(false);
  };

  const deletePost = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        loadPosts();
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  const filteredPosts = posts.filter((post: any) => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && post.published) || 
      (filter === 'draft' && !post.published);
    
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <MudLayout title="Posts" subtitle="Manage your blog posts">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-ping mx-auto"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Posts</h3>
            <p className="text-gray-600">Fetching your content...</p>
          </div>
        </div>
      </MudLayout>
    );
  }

  return (
    <ProtectedRoute requiredRole="author">
      <MudLayout title="Posts" subtitle="Manage and organize your blog posts">
        {/* MatDash Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">My Posts</h2>
              <p className="text-gray-600">Create and manage your blog content</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              <Link
                href="/dashboard/posts/create"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Post</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { id: 'all', name: 'Total Posts', count: posts.length, color: 'blue', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 'published', name: 'Published', count: posts.filter((p: any) => p.published).length, color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'draft', name: 'Drafts', count: posts.filter((p: any) => !p.published).length, color: 'orange', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
          ].map((stat) => (
            <button
              key={stat.id}
              onClick={() => setFilter(stat.id)}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${
                filter === stat.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.count}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' : 'text-orange-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                {post.image_url && (
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-1">
                          {post.title}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {post.published ? '● Published' : '● Draft'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    </div>
                  </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{post.author.username}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/post/${post.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/dashboard/posts/edit/${post.id}`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? `No posts match "${searchTerm}". Try a different search term.`
                    : 'Get started by creating your first blog post'
                  }
                </p>
                {!searchTerm && (
                  <Link
                    href="/dashboard/posts/create"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    Create Your First Post
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </MudLayout>
    </ProtectedRoute>
  );
}