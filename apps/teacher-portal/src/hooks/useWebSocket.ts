import React from 'react';
import { useParentStore } from '../stores/parentStore';
import type { Activity } from '../stores/parentStore';

interface WebSocketMessage {
  type: 'activity' | 'progress_update' | 'suggestion' | 'alert';
  data: any;
  timestamp: string;
}

export const useWebSocket = (url?: string) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const websocket = React.useRef<WebSocket | null>(null);
  
  const { addActivity, updateChild } = useParentStore();

  const connect = React.useCallback(() => {
    if (!url) return;
    
    try {
      websocket.current = new WebSocket(url);
      
      websocket.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket connected');
      };

      websocket.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'activity':
              addActivity(message.data as Activity);
              break;
              
            case 'progress_update':
              const { childId, progress } = message.data;
              updateChild(childId, { progress });
              break;
              
            case 'suggestion':
              // Handle new suggestions
              console.log('New suggestion:', message.data);
              break;
              
            case 'alert':
              // Handle alerts/notifications
              console.log('Alert:', message.data);
              break;
              
            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      websocket.current.onerror = (event) => {
        setError('WebSocket error occurred');
        console.error('WebSocket error:', event);
      };

      websocket.current.onclose = (event) => {
        setIsConnected(false);
        
        if (!event.wasClean) {
          setError('Connection lost. Attempting to reconnect...');
          // Attempt to reconnect after 3 seconds
          setTimeout(connect, 3000);
        }
      };
    } catch (err) {
      setError('Failed to connect to WebSocket');
      console.error('WebSocket connection error:', err);
    }
  }, [url, addActivity, updateChild]);

  const disconnect = React.useCallback(() => {
    if (websocket.current) {
      websocket.current.close(1000, 'User requested disconnect');
      websocket.current = null;
    }
  }, []);

  const sendMessage = React.useCallback((message: any) => {
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Connect on mount if URL is provided
  React.useEffect(() => {
    if (url) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
  };
};

// Hook for mock WebSocket functionality during development
export const useMockWebSocket = () => {
  const { addActivity } = useParentStore();
  
  React.useEffect(() => {
    // Mock real-time activities
    const interval = setInterval(() => {
      const mockActivities: Activity[] = [
        {
          id: Date.now().toString(),
          childId: '1',
          childName: 'Emma Chen',
          type: 'lesson_completed',
          title: 'Completed Fraction Practice',
          description: 'Successfully completed 8/10 fraction problems',
          timestamp: new Date().toISOString(),
          subject: 'Mathematics',
          score: 80,
          icon: '📚',
        },
        {
          id: (Date.now() + 1).toString(),
          childId: '2',
          childName: 'Marcus Johnson',
          type: 'skill_mastered',
          title: 'Mastered Reading Comprehension',
          description: 'Achieved 95% accuracy on story comprehension exercises',
          timestamp: new Date().toISOString(),
          subject: 'Reading',
          score: 95,
          icon: '🏆',
        },
      ];

      // Randomly add a mock activity
      if (Math.random() > 0.7) {
        const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
        addActivity({
          ...randomActivity,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addActivity]);

  return {
    isConnected: true,
    error: null,
  };
};