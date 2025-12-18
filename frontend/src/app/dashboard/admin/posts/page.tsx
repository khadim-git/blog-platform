'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import MudLayout from '../../../../components/MudLayout';
import { postsAPI } from '../../../../lib/api';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postsAPI.getAllPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Failed to load posts');
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter === 'published') {
      filtered = filtered.filter(post => post.published === true);
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter(post => post.published === false);
    }
    setFilteredPosts(filtered);
  }, [searchTerm, statusFilter, posts]);

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

  const togglePublish = async (id: number, published: boolean) => {
    try {
      await postsAPI.updatePost(id, { published });
      loadPosts();
    } catch (error) {
      alert('Failed to update post');
    }
  };

  const editPost = (id: number) => {
    window.location.href = `/dashboard/posts/edit/${id}`;
  };

  if (loading) {
    return (
      <MudLayout title="All Posts" subtitle="Manage all blog posts">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </MudLayout>
    );
  }

  return (
    <ProtectedRoute requiredRole="author">
      <MudLayout title="All Posts" subtitle="Manage all blog posts (Admin)">
        {/* Posts DataTable */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Posts DataTable</h3>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Search posts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm" 
                />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.length > 0 ? filteredPosts.map((post: any, index) => (
                  <tr key={post.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#{post.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-xs">{post.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {post.author.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-900">{post.author.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? '● Published' : '● Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => window.open(`/post/${post.slug}`, '_blank')}
                          className="p-1 text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                          title="View Post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => togglePublish(post.id, !post.published)}
                          className={`p-1 rounded transition-colors ${
                            post.published ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={post.published ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                          </svg>
                        </button>
                        <button 
                          onClick={() => editPost(post.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors" 
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors" 
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100">Previous</button>
              <button className="px-3 py-1 text-sm bg-indigo-500 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100">Next</button>
            </div>
          </div>
        </div>
      </MudLayout>
    </ProtectedRoute>
  );
}