import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

export const CommentItem = ({ comment, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const isAuthor = comment.userId?._id === user?._id || comment.userId === user?._id;
  const canDelete = isAuthor || isAdmin;

  return (
    <div className="flex items-start space-x-3 group py-3">
      <div className="h-8 w-8 rounded-full bg-violet/10 text-violet border border-violet/20 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-xs">
        {comment.userId?.avatar ? (
          <img
            src={comment.userId.avatar}
            alt={comment.userId.name}
            className="h-full w-full object-cover"
          />
        ) : (
          comment.userId?.name?.charAt(0) || 'U'
        )}
      </div>

      <div className="flex-1 min-w-0 bg-ivory-soft/60 dark:bg-midnight-slate/50 hover:bg-ivory-soft dark:hover:bg-midnight-slate/80 rounded-xl p-3.5 border border-ivory-subtle dark:border-midnight-subtle transition-colors">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-ivory-text dark:text-midnight-text">
              {comment.userId?.name || 'Teammate'}
            </span>
            <span className="text-[10px] text-ivory-muted dark:text-midnight-muted font-mono">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          {canDelete && (
            <button
              onClick={() => onDelete(comment._id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-ivory-muted hover:text-roseAccent transition-all cursor-pointer"
              title="Delete Comment"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-ivory-text dark:text-midnight-text whitespace-pre-wrap leading-relaxed">
          {comment.text}
        </p>
      </div>
    </div>
  );
};
