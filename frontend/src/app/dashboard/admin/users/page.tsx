'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import MudLayout from '../../../components/MudLayout';
import { usersAPI } from '../../../lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user',
    avatar_url: ''
  });
  const [editFormData, setEditFormData] = useState({
    email: '',
    username: '',
    role: 'user',
    avatar_url: '',
    is_active: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersAPI.createUser(formData);
      setFormData({ email: '', username: '', password: '', role: 'user', avatar_url: '' });
      setShowCreateForm(false);
      loadUsers();
      alert('User created successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to create user');
    }
  };

  const deleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(id);
        loadUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const updateUserStatus = async (id: number, role: string, is_active: boolean) => {
    try {
      await usersAPI.updateUser(id, { role, is_active });
      loadUsers();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleEditUser = (user: any) => {
    window.location.href = `/dashboard/admin/users/edit/${user.id}`;
  };



  if (loading) {
    return (
      <MudLayout title="Users" subtitle="Manage system users">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </MudLayout>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <MudLayout title="Users" subtitle="Manage all system users">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Users ({users.length})</h2>
          <button
            onClick={() => window.location.href = '/dashboard/admin/users/create'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New User
          </button>
        </div>





        {/* DataTable */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Users ({users.length})</h3>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm" 
                />
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="user">Reader</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">User Details</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user: any, index) => (
                  <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#{user.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'author' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'author' ? 'Author' : 'Reader'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.is_verified ? '✓ Verified' : '⚠ Unverified'}
                        </span>
                        {user.email === 'admin@blog.com' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            ● Active
                          </span>
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.is_active}
                              onChange={() => updateUserStatus(user.id, user.role, !user.is_active)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-xs font-medium text-gray-700">
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </label>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors" 
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {user.email === 'admin@blog.com' ? (
                          <span className="p-1 text-gray-400" title="Protected">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </span>
                        ) : (
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors" 
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
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