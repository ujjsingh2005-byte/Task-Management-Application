import React, { useState } from 'react';
import { CommentItem } from './CommentItem';
import { Button } from '../common/Button';
import { Send, MessageSquare } from 'lucide-react';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';

export const CommentList = ({ taskId, comments = [], onCommentAdded, onCommentDeleted }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await commentService.addComment(taskId, text.trim());
      if (res.success && res.data?.comment) {
        setText('');
        if (onCommentAdded) onCommentAdded(res.data.comment);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(taskId, commentId);
      if (onCommentDeleted) onCommentDeleted(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-ivory-text dark:text-midnight-text pb-3 border-b border-ivory-subtle dark:border-midnight-subtle">
        <MessageSquare className="h-4 w-4 text-violet" />
        <span>Discussion ({comments.length})</span>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
        <div className="h-8 w-8 rounded-full bg-violet/10 text-violet border border-violet/20 flex items-center justify-center text-xs font-bold shrink-0">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 space-y-2">
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment or mention team members..."
            className="w-full px-3.5 py-2.5 text-xs bg-ivory-soft/60 dark:bg-midnight-slate/50 border border-ivory-subtle dark:border-midnight-subtle text-ivory-text dark:text-midnight-text placeholder-ivory-muted dark:placeholder-midnight-muted rounded-xl focus:bg-ivory-paper dark:focus:bg-midnight-ink focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-all"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="primary"
              icon={Send}
              loading={submitting}
              disabled={!text.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="divide-y divide-ivory-subtle/60 dark:divide-midnight-subtle/80 pt-2">
        {comments.length === 0 ? (
          <p className="text-center py-8 text-xs text-ivory-muted dark:text-midnight-muted font-medium">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
