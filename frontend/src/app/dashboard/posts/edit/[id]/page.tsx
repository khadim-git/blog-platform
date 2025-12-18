'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import MudLayout from '../../../../components/MudLayout';
import CategoryTagSelector from '../../../../components/CategoryTagSelector';
import { getToken } from '../../../../lib/auth';
import { postsAPI } from '../../../../lib/api';

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    image_url: '',
    category_ids: [] as number[],
    tag_ids: [] as number[]
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const post = await postsAPI.getPost(params.id as string);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          published: post.published,
          image_url: post.image_url || '',
          category_ids: post.categories ? post.categories.map((c: any) => c.id) : [],
          tag_ids: post.tags ? post.tags.map((t: any) => t.id) : []
        });
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      alert('Failed to load post');
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, image_url: `http://localhost:8000${data.url}` });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await postsAPI.updatePost(parseInt(params.id as string), formData);
      router.push('/dashboard/posts');
    } catch (error: any) {
      setError(error.message || 'Failed to update post');
    }
  };

  if (loading) {
    return (
      <MudLayout title="Edit Post" subtitle="Update post content">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </MudLayout>
    );
  }

  return (
    <ProtectedRoute requiredRole="author">
      <MudLayout title="Edit Post" subtitle="Update your post content">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Post Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter an engaging title for your post..."
                className="w-full px-4 py-3 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={3}
                placeholder="Write a brief description of your post..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                This will be shown in post previews and search results.
              </p>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              
              {!formData.image_url ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Featured Image</h4>
                  <p className="text-gray-500 mb-4">Drag and drop or click to select an image</p>
                  <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {uploading ? 'Uploading...' : 'Choose Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img src={formData.image_url} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, image_url: ''})}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Image uploaded successfully</p>
                    <label className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-sm">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Categories and Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories & Tags</h3>
              <CategoryTagSelector
                selectedCategories={formData.category_ids}
                selectedTags={formData.tag_ids}
                onCategoriesChange={(categories) => setFormData({...formData, category_ids: categories})}
                onTagsChange={(tags) => setFormData({...formData, tag_ids: tags})}
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                rows={20}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Supports Markdown formatting
                </p>
                <p className="text-sm text-gray-500">
                  {formData.content.length} characters
                </p>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h3>
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-3 block text-sm font-medium text-gray-900">
                  Publish immediately
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Update Post
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/posts')}
                  className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </MudLayout>
    </ProtectedRoute>
  );
}