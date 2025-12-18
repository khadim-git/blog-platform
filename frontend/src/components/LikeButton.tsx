'use client';

import { useState, useEffect } from 'react';
import { likesAPI } from '../lib/api';
import { getUser } from '../lib/auth';

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      const response = await likesAPI.toggleLike(postId);
      if (response.liked) {
        setLikes(likes + 1);
        setIsLiked(true);
      } else {
        setLikes(likes - 1);
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Failed to toggle like');
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center space-x-1 hover:text-red-600 transition-colors"
    >
      <svg 
        className={`w-4 h-4 ${isLiked ? 'text-red-500' : 'text-gray-400'}`} 
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>{likes}</span>
    </button>
  );
}