'use client';

import { useState, useEffect } from 'react';
import { commentsAPI } from '@/lib/api';
import Cookies from 'js-cookie';

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  created_at: string;
  like_count: number;
  replies?: Comment[];
}

interface FacebookCommentsProps {
  postId: number;
  user: any;
}

export default function FacebookComments({ postId, user }: FacebookCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await commentsAPI.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      console.log('User:', user);
      console.log('Token:', Cookies.get('token'));
      console.log('Submitting comment:', { content: newComment, post_id: postId });
      const result = await commentsAPI.createComment({
        content: newComment,
        post_id: postId,
      });
      console.log('Comment submitted:', result);
      setNewComment('');
      loadComments();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error: any) {
      console.error('Comment submit error:', error);
      if (error.message.includes('Unauthorized')) {
        alert('Please log in to post comments');
        window.location.href = '/login';
      } else {
        alert(`Failed to submit comment: ${error.message}`);
      }
    }
  };

  const handleReplySubmit = async (commentId: number) => {
    if (!user || !replyText.trim()) return;

    try {
      console.log('Submitting reply:', { content: replyText, post_id: postId, parent_id: commentId });
      const result = await commentsAPI.createComment({
        content: replyText,
        post_id: postId,
        parent_id: commentId
      });
      console.log('Reply submitted:', result);
      setReplyText('');
      setReplyingTo(null);
      loadComments();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error: any) {
      console.error('Reply submit error:', error);
      alert(`Failed to submit reply: ${error.message}`);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!user) return;
    
    try {
      const result = await commentsAPI.toggleLike(commentId);
      
      const newLikedComments = new Set(likedComments);
      if (result.liked) {
        newLikedComments.add(commentId);
      } else {
        newLikedComments.delete(commentId);
      }
      setLikedComments(newLikedComments);
      
      // Reload comments to get updated like counts
      loadComments();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const renderAvatar = (author: any, size: 'sm' | 'md' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
    const username = author?.username || 'U';
    
    if (author?.avatar_url) {
      return (
        <img 
          src={author.avatar_url} 
          alt={username} 
          className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
        />
      );
    }
    
    return (
      <div className={`${sizeClass} rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0`}>
        {username.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="comments-header p-4">
        <div className="comments-count">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </div>
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="comment-form p-4 border-t border-gray-100">
          <div className="flex gap-3">
            {renderAvatar(user)}
            <div className="flex-1">
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="comment-input"
                  rows={1}
                  style={{width: '100%'}}
                />
                {newComment.trim() && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="comment-submit"
                    >
                      Post
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="mb-3">
              <svg className="w-8 h-8 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-3">Join the conversation!</p>
            <div className="space-x-2">
              <a href="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Log in</a>
              <a href="/register" className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">Sign up</a>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="divide-y divide-gray-100">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4">
            <div className="flex gap-3">
              {renderAvatar(comment.author)}
              <div className="flex-1 min-w-0">
                <div className="comment-bubble">
                  <div className="comment-author">{comment.author.username}</div>
                  <div className="comment-content">{comment.content}</div>
                </div>
                
                <div className="comment-actions">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className={`comment-action ${likedComments.has(comment.id) ? 'liked' : ''}`}
                  >
                    <svg className="w-4 h-4 inline mr-1" fill={likedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {likedComments.has(comment.id) ? 'Liked' : 'Like'} ({comment.like_count || 0})
                  </button>
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="comment-action"
                  >
                    Reply
                  </button>
                  <span className="comment-time">{formatTime(comment.created_at)}</span>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && user && (
                  <div className="reply-container mt-3">
                    <div className="flex gap-2">
                      {renderAvatar(user, 'sm')}
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.author.username}...`}
                          className="comment-input text-sm"
                          rows={1}
                          style={{width: '100%'}}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyText.trim()}
                            className="comment-submit text-xs"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="reply-container mt-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2 mb-3">
                        {renderAvatar(reply.author, 'sm')}
                        <div className="flex-1 min-w-0">
                          <div className="comment-bubble text-sm">
                            <div className="comment-author">{reply.author.username}</div>
                            <div className="comment-content">{reply.content}</div>
                          </div>
                          <div className="comment-actions">
                            <button 
                              onClick={() => handleLike(reply.id)}
                              className={`comment-action ${likedComments.has(reply.id) ? 'liked' : ''}`}
                            >
                              <svg className="w-4 h-4 inline mr-1" fill={likedComments.has(reply.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              {likedComments.has(reply.id) ? 'Liked' : 'Like'} ({reply.like_count || 0})
                            </button>
                            <button 
                              onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                              className="comment-action"
                            >
                              Reply
                            </button>
                            <span className="comment-time">{formatTime(reply.created_at)}</span>
                          </div>
                          
                          {/* Nested Reply Form */}
                          {replyingTo === reply.id && user && (
                            <div className="mt-2">
                              <div className="flex gap-2">
                                {renderAvatar(user, 'sm')}
                                <div className="flex-1">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${reply.author.username}...`}
                                    className="comment-input text-sm"
                                    rows={1}
                                    style={{width: '100%'}}
                                  />
                                  <div className="flex justify-between items-center mt-2">
                                    <button
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                      }}
                                      className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleReplySubmit(comment.id)}
                                      disabled={!replyText.trim()}
                                      className="comment-submit text-xs"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Comments */}
      {comments.length === 0 && (
        <div className="no-comments">
          <div className="no-comments-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-lg font-medium mb-2">No comments yet</div>
          <div>Be the first to share what you think!</div>
        </div>
      )}
      
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Comment submitted successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}