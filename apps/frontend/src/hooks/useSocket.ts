import { useEffect } from 'react';
import { useSocketStore } from '../stores/socket.store';
import { useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';

export function useSocket() {
  const { setConnected, handleEvent } = useSocketStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only connect if there's a token
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const socket = io('/', {
      auth: { token },
      path: '/api/socket.io',
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setConnected(true);
      // Join store room
      socket.emit('joinRoom', 'store_updates');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Handle generic events for the store
    socket.on('event', (eventData) => {
      handleEvent(eventData);
    });

    // Specific cache invalidations
    socket.on('newOrder', (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['recentOrders'] });
      handleEvent({ type: 'newOrder', payload: order });
    });

    socket.on('newMessage', (message) => {
      // Invalidate specific thread if open
      queryClient.invalidateQueries({ queryKey: ['customerConversation', message.customerId] });
      queryClient.invalidateQueries({ queryKey: ['recentReplies'] });
      handleEvent({ type: 'newMessage', payload: message });
    });

    socket.on('automationUpdate', (update) => {
      queryClient.invalidateQueries({ queryKey: ['automationActivity'] });
      handleEvent({ type: 'automationUpdate', payload: update });
    });
    
    socket.on('statusUpdate', (update) => {
      if (update.type === 'message') {
        queryClient.invalidateQueries({ queryKey: ['customerConversation', update.customerId] });
      }
      handleEvent({ type: 'statusUpdate', payload: update });
    });

    return () => {
      socket.disconnect();
    };
  }, [setConnected, handleEvent, queryClient]);
}
