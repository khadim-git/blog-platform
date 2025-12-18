'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import MudLayout from '../../../../components/MudLayout';
import { usersAPI } from '../../../../lib/api';
import { getUser } from '../../../../lib/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar_url: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await usersAPI.getMe();
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
          avatar_url: userData.avatar_url || ''
        });
        setImagePreview(userData.avatar_url || '');
      } catch (error) {
        const currentUser = getUser();
        if (currentUser) {
          setUser(currentUser);
          setFormData({
            username: currentUser.username,
            email: currentUser.email,
            avatar_url: currentUser.avatar_url || ''
          });
          setImagePreview(currentUser.avatar_url || '');
        }
      }
    };
    
    loadUserData();
  }, []);

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
      
      // Upload new image if selected
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
      
      // Update user profile
      await usersAPI.updateProfile({
        username: formData.username,
        email: formData.email,
        avatar_url: avatarUrl
      });
      
      setMessage('Profile updated successfully!');
      
      // Update local storage
      const updatedUser = { ...user, ...formData, avatar_url: avatarUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="user">
      <MudLayout title="Profile" subtitle="Manage your account settings">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            
            {message && (
              <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="text-center">
                <div className="mb-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover mx-auto" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto text-2xl font-bold text-gray-600">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {(user?.role === 'read' || user?.role === 'reader' || user?.role === 'user') ? (
                  <p className="text-sm text-gray-500">Profile image cannot be changed</p>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                )}
              </div>

              {/* Username - Read-only for read/author roles */}
              {user?.role === 'admin' ? (
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
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>
              )}

              {/* Email - Read-only for read/author roles */}
              {user?.role === 'admin' ? (
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
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              )}

              {/* Avatar URL - Hidden for read role */}
              {user?.role !== 'read' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL (optional)</label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              )}

              {/* Submit Button - Only for non-read roles or admin */}
              {(user?.role !== 'read' && user?.role !== 'reader' && user?.role !== 'user') && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              )}
            </form>
          </div>
        </div>
      </MudLayout>
    </ProtectedRoute>
  );
}