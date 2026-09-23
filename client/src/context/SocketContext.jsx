import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_EVENTS } from '../utils/constants';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setConnected(false);
    });

    // Synchronize initial list of online users
    newSocket.on(SOCKET_EVENTS.PRESENCE_SYNC, ({ onlineUserIds: ids }) => {
      setOnlineUserIds(new Set(ids));
    });

    // User came online
    newSocket.on(SOCKET_EVENTS.USER_ONLINE, ({ userId }) => {
      setOnlineUserIds((prev) => new Set([...prev, userId]));
    });

    // User went offline
    newSocket.on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token]);

  const joinTaskRoom = (taskId) => {
    if (socketRef.current && taskId) {
      socketRef.current.emit(SOCKET_EVENTS.JOIN_TASK, { taskId });
    }
  };

  const leaveTaskRoom = (taskId) => {
    if (socketRef.current && taskId) {
      socketRef.current.emit(SOCKET_EVENTS.LEAVE_TASK, { taskId });
    }
  };

  const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUserIds.has(userId.toString());
  };

  const value = {
    socket,
    connected,
    onlineUserIds,
    isUserOnline,
    joinTaskRoom,
    leaveTaskRoom,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
