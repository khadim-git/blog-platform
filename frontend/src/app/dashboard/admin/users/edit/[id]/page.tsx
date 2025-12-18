'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../../../components/ProtectedRoute';
import MudLayout from '../../../../../../components/MudLayout';
import { usersAPI } from '../../../../../../lib/api';

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    role: 'user',
    avatar_url: '',
    is_active: true
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUser();
  }, [params.id]);

  const loadUser = async () => {
    try {
      const userData = await usersAPI.getUser(parseInt(params.id));
      setUser(userData);
      setFormData({
        email: userData.email,
        username: userData.username,
        role: userData.role,
        avatar_url: userData.avatar_url || '',
        is_active: userData.is_active
      });
      setImagePreview(userData.avatar_url || '');
    } catch (error) {
      setMessage('Failed to load user');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let avatarUrl = formData.avatar_url;
      
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', profileImage);
        
        const uploadResponse = await fetch('http://localhost:8000/upload/', {
          method: 'POST',
          body: imageFormData
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          avatarUrl = uploadResult.file_url;
        }
      }
      
      await usersAPI.updateUser(parseInt(params.id), {
        ...formData,
        avatar_url: avatarUrl
      });
      
      setMessage('User updated successfully!');
      setTimeout(() => router.push('/dashboard/admin/users'), 1500);
      
    } catch (error: any) {
      setMessage(error.message || 'Failed to update user');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <MudLayout title="Edit User" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </MudLayout>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <MudLayout title="Edit User" subtitle={`Editing ${user.username}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit User: {user.username}</h2>
              <button
                onClick={() => router.push('/dashboard/admin/users')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
            
            {message && (
              <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover mx-auto" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto text-2xl font-bold text-gray-600">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Reader</option>
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-sm">Active User</label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/admin/users')}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </MudLayout>
    </ProtectedRoute>
  );
}