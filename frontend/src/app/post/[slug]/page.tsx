'use client';

import { useEffect, useState } from 'react';
import { postsAPI, commentsAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FacebookComments from '@/components/FacebookComments';
import Cookies from 'js-cookie';

export default function PostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await fetch('http://localhost:8000/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Failed to load user data');
      }
    };
    
    loadUserData();
    loadPost();
  }, [params.slug]);

  const loadPost = async () => {
    try {
      const data = await postsAPI.getPost(params.slug);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post:', error);
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
              <div className="w-20 h-20 border-4 border-yellow-300 border-t-yellow-500 rounded-full animate-spin mx-auto" style={{borderColor: '#F4B342', borderTopColor: '#DE1A58'}}></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-ping mx-auto opacity-75" style={{borderTopColor: '#8F0177'}}></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Loading Article</h3>
            <p className="text-gray-200 text-lg">Fetching the latest content for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-3xl font-bold text-white mb-2">Article Not Found</h2>
            <p className="text-gray-200">The article you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        {post.image_url && (
          <div className="h-96 relative overflow-hidden" style={{background: 'linear-gradient(45deg, #360185 0%, #8F0177 50%, #DE1A58 100%)'}}>
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover absolute inset-0 opacity-80"
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(54,1,133,0.8) 0%, rgba(143,1,119,0.4) 50%, rgba(222,26,88,0.2) 100%)'}}></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
                <div className="flex items-center text-white/90 text-lg">
                  <div className="flex items-center backdrop-blur-sm rounded-full px-4 py-2" style={{backgroundColor: 'rgba(244,179,66,0.2)'}}>
                    {post.author.avatar_url ? (
                      <img src={post.author.avatar_url} alt={post.author.username} className="w-8 h-8 rounded-full object-cover mr-3" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" style={{backgroundColor: '#DE1A58'}}>
                        {post.author.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium">{post.author.username}</span>
                    <span className="mx-3">•</span>
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!post.image_url && (
          <div className="py-20" style={{background: 'linear-gradient(135deg, #360185 0%, #8F0177 50%, #DE1A58 100%)'}}>
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
              <div className="flex items-center text-white/90 text-lg">
                <div className="flex items-center backdrop-blur-sm rounded-full px-4 py-2" style={{backgroundColor: 'rgba(244,179,66,0.2)'}}>
                  {post.author.avatar_url ? (
                    <img src={post.author.avatar_url} alt={post.author.username} className="w-8 h-8 rounded-full object-cover mr-3" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" style={{backgroundColor: '#F4B342'}}>
                      {post.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{post.author.username}</span>
                  <span className="mx-3">•</span>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12" style={{border: '2px solid #8F0177'}}>
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="leading-relaxed text-lg whitespace-pre-wrap font-light" style={{color: '#360185'}}>
                {post.content}
              </div>
            </div>
            
            {/* Article Footer */}
            <div className="mt-12 pt-8" style={{borderTop: '2px solid #DE1A58'}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {post.author.avatar_url ? (
                    <img src={post.author.avatar_url} alt={post.author.username} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{background: 'linear-gradient(45deg, #8F0177, #DE1A58)'}}>
                      {post.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold" style={{color: '#360185'}}>{post.author.username}</p>
                    <p className="text-sm" style={{color: '#8F0177'}}>Published on {new Date(post.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      const url = window.location.href;
                      navigator.share ? 
                        navigator.share({ title: post.title, url }) :
                        navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
                    }}
                    className="p-2 rounded-full transition-colors" 
                    style={{color: '#8F0177'}} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F4B342'} 
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Share this post"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
                      window.open(twitterUrl, '_blank');
                    }}
                    className="p-2 rounded-full transition-colors" 
                    style={{color: '#DE1A58'}} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F4B342'} 
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Share on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <FacebookComments postId={post.id} user={user} />
      </div>
      
      <Footer />
    </div>
  );
}