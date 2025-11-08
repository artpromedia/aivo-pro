import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePlatformStore } from '@/stores/platformStore';
import { PlatformMetrics, SystemAlert, AIProvider } from '@/types';

export function useWebSocket(url: string) {
  const socketRef = useRef<Socket | null>(null);
  const { 
    setConnected, 
    updateMetrics, 
    addAlert, 
    updateAIProviders,
    isConnected,
    metrics,
    alerts,
    aiProviders 
  } = usePlatformStore();

  useEffect(() => {
    // Get auth token (in production, this would be from secure storage)
    const token = localStorage.getItem('superAdminToken') || 'mock-super-admin-token';

    // Initialize WebSocket connection
    socketRef.current = io(url, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('🔌 WebSocket connected to Super Admin');
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      setConnected(false);
    });

    socket.on('reconnect', () => {
      console.log('🔌 WebSocket reconnected');
      setConnected(true);
    });

    // Platform metrics updates
    socket.on('metrics:update', (data: PlatformMetrics) => {
      updateMetrics(data);
    });

    // System alerts
    socket.on('alert:new', (alert: SystemAlert) => {
      addAlert(alert);
    });

    socket.on('alert:critical', (alert: SystemAlert) => {
      addAlert({ ...alert, severity: 'critical' });
    });

    // AI provider status updates
    socket.on('ai:providers:update', (providers: AIProvider[]) => {
      updateAIProviders(providers);
    });

    socket.on('ai:provider:status', (data: { providerId: string; status: string }) => {
      // Update specific provider status
      updateAIProviders(
        aiProviders.map(p => 
          p.id === data.providerId 
            ? { ...p, status: data.status as any }
            : p
        )
      );
    });

    // Support ticket events
    socket.on('support:ticket:new', (ticket) => {
      addAlert({
        id: `ticket-${ticket.id}`,
        severity: ticket.severity === 'critical' ? 'critical' : 'warning',
        title: 'New Support Ticket',
        message: `${ticket.severity.toUpperCase()}: ${ticket.title}`,
        timestamp: new Date(),
        resolved: false,
        component: 'support',
        actions: [
          {
            id: 'view',
            label: 'View Ticket',
            type: 'investigate',
            url: `/support/tickets/${ticket.id}`
          }
        ]
      });
    });

    // System events
    socket.on('system:maintenance', (data) => {
      addAlert({
        id: `maintenance-${Date.now()}`,
        severity: 'info',
        title: 'Scheduled Maintenance',
        message: data.message,
        timestamp: new Date(),
        resolved: false,
        component: 'system',
        actions: []
      });
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error);
      setConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [url]);

  // Emit events to server
  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  // Subscribe to specific events
  const subscribe = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      
      // Return unsubscribe function
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event, callback);
        }
      };
    }
  };

  return {
    isConnected,
    metrics,
    alerts,
    aiProviders,
    emit,
    subscribe,
    socket: socketRef.current
  };
}