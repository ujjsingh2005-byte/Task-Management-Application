import React from 'react';
import { useSocket } from '../../context/SocketContext';

export const PresenceIndicator = ({ userId, showText = false, size = 'md' }) => {
  const { isUserOnline } = useSocket();
  const online = isUserOnline(userId);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <div className="inline-flex items-center space-x-1.5" title={online ? 'Active in workspace' : 'Offline'}>
      <span
        className={`relative inline-block rounded-full ${sizeClasses[size] || sizeClasses.md} ${
          online ? 'bg-aqua shadow-aqua-glow' : 'bg-ivory-border dark:bg-midnight-graphite'
        }`}
      >
        {online && (
          <span className="absolute inset-0 rounded-full bg-aqua-bright animate-ping opacity-60" />
        )}
      </span>
      {showText && (
        <span
          className={`text-xs font-medium ${
            online ? 'text-aqua-deep dark:text-aqua font-semibold' : 'text-ivory-muted dark:text-midnight-muted'
          }`}
        >
          {online ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  );
};
