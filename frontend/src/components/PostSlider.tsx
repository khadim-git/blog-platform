'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  author: {
    username: string;
  };
  created_at: string;
}

interface PostSliderProps {
  posts: Post[];
}

export default function PostSlider({ posts }: PostSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredPosts = posts.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  if (featuredPosts.length === 0) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      {featuredPosts.map((post, index) => (
        <div
          key={post.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === currentSlide 
              ? 'opacity-100 scale-100 z-10' 
              : 'opacity-0 scale-105 z-0'
          }`}
        >
          <div className="relative h-full">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-700"></div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-8">
                <h2 className={`text-4xl md:text-6xl font-bold mb-6 transform transition-all duration-1000 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  {post.title}
                </h2>
                <p className={`text-xl md:text-2xl mb-8 opacity-90 transform transition-all duration-1000 delay-500 ${
                  index === currentSlide ? 'translate-y-0 opacity-90' : 'translate-y-8 opacity-0'
                }`}>
                  {post.excerpt}
                </p>
                <div className={`flex items-center justify-center space-x-6 mb-8 transform transition-all duration-1000 delay-700 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <div className="flex items-center space-x-2">
                    {(post.author as any).avatar_url ? (
                      <img src={(post.author as any).avatar_url} alt={post.author.username} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-sm font-bold">
                        {post.author.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-lg">By {post.author.username}</span>
                  </div>
                  <span>•</span>
                  <span className="text-lg">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <Link
                  href={`/post/${post.slug}`}
                  className={`inline-block bg-white text-gray-900 px-8 py-4 rounded-full hover:bg-gray-100 transition-all font-semibold text-lg transform hover:scale-105 duration-1000 delay-900 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  Read Full Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}