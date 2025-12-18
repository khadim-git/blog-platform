'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postsAPI } from '@/utils/api';
import Navbar from '@/components/Navbar';
import LikeButton from '@/components/LikeButton';
import PostSlider from '@/components/PostSlider';
import Footer from '@/components/Footer';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [postsWithComments, setPostsWithComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postsAPI.getPosts(0, 50);
      setPosts(data);
      
      // Sort by recent posts
      const sortedPosts = data
        .sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })
        .slice(0, 10)
        .map((post: any) => ({ ...post, commentCount: post.comments_count || 0 }));
      
      setPostsWithComments(sortedPosts);
    } catch (error) {
      console.error('Failed to load posts');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 rounded-full animate-spin mx-auto" style={{borderColor: '#F4B342', borderTopColor: '#DE1A58'}}></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping mx-auto opacity-75" style={{borderTopColor: '#8F0177'}}></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Loading Posts</h3>
            <p className="text-gray-200 text-lg">Please wait while we fetch the latest content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Full-Screen Slider */}
      <PostSlider posts={postsWithComments} />
      
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text mb-6">About Our Blog</h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Welcome to our digital space where stories come alive, ideas flourish, and knowledge is shared. 
              We're passionate about creating content that inspires, educates, and connects people from all walks of life.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-secondary">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Quality Content</h3>
              <p className="text-secondary">We curate and create high-quality articles that provide real value to our readers.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#DE1A58'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Expert Authors</h3>
              <p className="text-secondary">Our team of experienced writers brings diverse perspectives and expertise to every post.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#F4B342'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Fresh Insights</h3>
              <p className="text-secondary">Stay updated with the latest trends, tips, and insights across various topics and industries.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Posts Section */}
      <section className="py-20" style={{background: 'linear-gradient(135deg, rgba(54,1,133,0.1) 0%, rgba(143,1,119,0.1) 50%, rgba(222,26,88,0.1) 100%)'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Recent & Popular Posts</h2>
              <p className="text-gray-200">Discover our latest stories and most loved content</p>
            </div>
            <Link 
              href="/posts"
              className="btn-primary"
            >
              View All Posts
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {postsWithComments.slice(0, 6).map((post: any) => (
              <Link key={post.id} href={`/post/${post.slug}`}>
                <div className="card cursor-pointer transition-all transform hover:-translate-y-1">
                  {post.image_url && (
                    <div className="h-48 bg-secondary">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-secondary text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Categories and Tags */}
                    <div className="mb-4">
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.categories.map((cat: any) => (
                            <span key={cat.id} className="px-2 py-1 bg-secondary text-white text-xs rounded-full">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag: any) => (
                            <span key={tag.id} className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: 'rgba(244,179,66,0.2)', color: '#360185'}}>
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-secondary">
                      <div className="flex items-center space-x-2">
                        {post.author.avatar_url ? (
                          <img src={post.author.avatar_url} alt={post.author.username} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {post.author.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>By {post.author.username}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <LikeButton postId={post.id} initialLikes={post.likes_count || 0} />
                        <span>{post.commentCount} comments</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {postsWithComments.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-primary mb-2">No posts yet</h3>
              <p className="text-secondary">Check back later for new content!</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}