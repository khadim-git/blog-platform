'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postsAPI } from 'src/lib/api';
import Navbar from 'src/components/Navbar';
import Footer from 'src/components/Footer';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryPosts();
  }, [params.slug]);

  const loadCategoryPosts = async () => {
    try {
      // Get all posts and filter by category
      const allPosts = await postsAPI.getPosts(0, 100);
      const categoryPosts = allPosts.filter((post: any) => {
        if (!post.categories || post.categories.length === 0) return false;
        return post.categories.some((cat: any) => 
          cat.slug === params.slug || cat.name.toLowerCase().replace(/\s+/g, '-') === params.slug.toLowerCase()
        );
      });
      setPosts(categoryPosts);
      
      if (categoryPosts.length > 0) {
        const matchedCategory = categoryPosts[0].categories.find((cat: any) => 
          cat.slug === params.slug || cat.name.toLowerCase().replace(/\s+/g, '-') === params.slug.toLowerCase()
        );
        setCategory(matchedCategory || { name: params.slug.replace(/-/g, ' ') });
      }
    } catch (error) {
      console.error('Failed to load category posts');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category ? category.name : 'Category'} Posts
            </h1>
            <p className="text-xl text-gray-600">Browse posts in this category</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/post/${post.slug}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer">
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Categories and Tags */}
                    <div className="mb-4">
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.categories.map((cat: any) => (
                            <span key={cat.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {(post.tags || post.post_tags) && (post.tags || post.post_tags).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(post.tags || post.post_tags).map((tag: any) => (
                            <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>By {post.author.username}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes_count || 0}</span>
                        </button>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">No posts in this category yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}