'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import MudLayout from '../../../../components/MudLayout';
import { commentsAPI } from '../../../../lib/api';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await commentsAPI.getPendingComments();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments');
    }
    setLoading(false);
  };

  const approveComment = async (id: number) => {
    try {
      await commentsAPI.approveComment(id);
      loadComments();
    } catch (error) {
      alert('Failed to approve comment');
    }
  };

  if (loading) {
    return (
      <MudLayout title="Comments" subtitle="Manage pending comments">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </MudLayout>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <MudLayout title="Comments" subtitle="Review and approve pending comments">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {comments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {comments.map((comment: any) => (
                <div key={comment.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-semibold text-gray-900">{comment.author.username}</span>
                      <span className="text-gray-500 text-sm ml-2">on "{comment.post_title}"</span>
                    </div>
                    <button
                      onClick={() => approveComment(comment.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending comments</p>
            </div>
          )}
        </div>
      </MudLayout>
    </ProtectedRoute>
  );
}