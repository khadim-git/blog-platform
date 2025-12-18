'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postsAPI, likesAPI } from 'src/lib/api';
import Navbar from 'src/components/Navbar';
import Footer from 'src/components/Footer';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  author: {
    username: string;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleLike = async (postId: number) => {
    try {
      await likesAPI.toggleLike(postId);
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const isLiked = likedPosts.has(postId);
          const newLikesCount = isLiked ? (post as any).likes_count - 1 : (post as any).likes_count + 1;
          return { ...post, likes_count: newLikesCount };
        }
        return post;
      });
      setPosts(updatedPosts);
      
      const newLikedPosts = new Set(likedPosts);
      if (likedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      setLikedPosts(newLikedPosts);
    } catch (error) {
      console.error('Failed to toggle like');
    }
  };

  useEffect(() => {
    loadPosts();
    loadCategories();
    loadTags();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, selectedTag]);

  const loadPosts = async () => {
    try {
      const data = await postsAPI.getPosts(0, 100);
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts');
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch('http://localhost:8000/tags/');
      const data = await response.json();
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags([]);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    
    if (selectedCategory) {
      filtered = filtered.filter((post: any) => 
        post.categories && post.categories.length > 0 && post.categories.some((cat: any) => 
          cat.name && cat.name.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter((post: any) => {
        const postTags = post.tags || post.post_tags || [];
        return postTags && postTags.length > 0 && postTags.some((tag: any) => 
          tag.name && tag.name.toLowerCase() === selectedTag.toLowerCase()
        );
      });
    }
    
    setFilteredPosts(filtered);
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
            <h3 className="text-2xl font-bold text-primary mb-3">Loading Posts</h3>
            <p className="text-secondary text-lg">Fetching the latest content for you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Blog Posts</h1>
          <p className="text-xl text-secondary">Discover our latest articles and insights</p>
        </div>

        {/* Filters */}
        {((categories && categories.length > 0) || (tags && tags.length > 0)) && (
          <div className="card p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              {categories && categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {tags && tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Tag</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Tags</option>
                    {tags.map((tag: any) => (
                      <option key={tag.id} value={tag.name}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedTag('');
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.slug}`}>
              <div className="card cursor-pointer transition-all">
                {post.image_url && (
                  <div className="h-48" style={{background: 'linear-gradient(45deg, #8F0177, #DE1A58)'}}>
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-primary mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-secondary text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Categories and Tags */}
                  <div className="mb-4">
                    {(post as any).categories && (post as any).categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(post as any).categories.map((cat: any) => (
                          <span key={cat.id} className="px-2 py-1 bg-secondary text-white text-xs rounded-full">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {((post as any).tags || (post as any).post_tags) && ((post as any).tags || (post as any).post_tags).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {((post as any).tags || (post as any).post_tags).map((tag: any) => (
                          <span key={tag.id} className="px-2 py-1 text-xs rounded-full" style={{backgroundColor: 'rgba(244,179,66,0.2)', color: '#360185'}}>
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-secondary mb-4">
                    <div className="flex items-center space-x-2">
                      {(post.author as any).avatar_url ? (
                        <img src={(post.author as any).avatar_url} alt={post.author.username} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {post.author.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>By {post.author.username}</span>
                    </div>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(post.id);
                        }}
                        className={`flex items-center space-x-1 transition-colors ${
                          likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{(post as any).likes_count || 0}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{(post as any).comments_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-primary mb-2">No posts found</h3>
            <p className="text-secondary">No posts match the selected filters.</p>
          </div>
        )}
        
        {posts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-primary mb-2">No posts yet</h3>
            <p className="text-secondary">Check back later for new content!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}