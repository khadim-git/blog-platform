'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postsAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TagPage({ params }: { params: { slug: string } }) {
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTagPosts();
  }, [params.slug]);

  const loadTagPosts = async () => {
    try {
      // Get all posts and filter by tag
      const allPosts = await postsAPI.getPosts(0, 100);
      const tagPosts = allPosts.filter((post: any) => {
        if (!post.tags || post.tags.length === 0) return false;
        return post.tags.some((tag: any) => 
          tag.slug === params.slug || tag.name.toLowerCase().replace(/\s+/g, '-') === params.slug.toLowerCase()
        );
      });
      setPosts(tagPosts);
      
      if (tagPosts.length > 0) {
        const matchedTag = tagPosts[0].tags.find((tag: any) => 
          tag.slug === params.slug || tag.name.toLowerCase().replace(/\s+/g, '-') === params.slug.toLowerCase()
        );
        setTag(matchedTag || { name: params.slug.replace(/-/g, ' ') });
      }
    } catch (error) {
      console.error('Failed to load tag posts');
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
              #{tag ? tag.name : 'Tag'} Posts
            </h1>
            <p className="text-xl text-gray-600">Browse posts with this tag</p>
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
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag: any) => (
                            <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {post.author.username}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">No posts with this tag yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}