'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Notification {
  message: string;
  type: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  latest: Notification | null;
  clearLatest: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

const WS_URL = 'http://localhost:5001';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latest, setLatest] = useState<Notification | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const s = io(WS_URL, { transports: ['websocket'] });
      setSocket(s);
      s.emit('join', user.id);
      s.on('user_followed', (data: Notification) => {
        setNotifications((prev) => [...prev, data]);
        setLatest(data);
      });
      s.on('post_created', (data: Notification) => {
        setNotifications((prev) => [...prev, data]);
        setLatest(data);
      });
      return () => {
        s.emit('leave', user.id);
        s.disconnect();
      };
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user?.id]);

  const clearLatest = () => setLatest(null);

  return (
    <NotificationContext.Provider value={{ notifications, latest, clearLatest }}>
      {children}
    </NotificationContext.Provider>
  );
}; 