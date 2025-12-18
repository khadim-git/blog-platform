'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { postsAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function AuthorPosts() {
  const params = useParams();
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthorPosts();
  }, []);

  const loadAuthorPosts = async () => {
    try {
      const allPosts = await postsAPI.getPosts(0, 1000);
      const authorPosts = allPosts.filter((post: any) => 
        post.author.username === params.username
      );
      setPosts(authorPosts);
      
      // Get author info from first post
      if (authorPosts.length > 0) {
        setAuthor(authorPosts[0].author);
      }
    } catch (error) {
      console.error('Failed to load author posts');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            {author?.avatar_url ? (
              <img src={author.avatar_url} alt={author.username} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-200" />
            ) : (
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 border-4 border-gray-200">
                {params.username?.toString().charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Posts by {params.username}
            </h1>
            <p className="text-gray-600">{posts.length} published posts</p>
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
                      <div className="flex items-center space-x-2">
                        {post.author.avatar_url ? (
                          <img src={post.author.avatar_url} alt={post.author.username} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {post.author.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>By {post.author.username}</span>
                      </div>
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
            <div className="text-center py-12">
              <p className="text-gray-500">No published posts found for this author.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}