import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';

export const useWebSocket = (events) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    const connect = useCallback(() => {
        try {
            socketService.connect();
            setConnected(true);
            setError(null);
        } catch (err) {
            setError(err);
            setConnected(false);
        }
    }, []);

    useEffect(() => {
        connect();

        // Subscribe to events
        Object.entries(events).forEach(([event, handler]) => {
            socketService.subscribe(event, handler);
        });

        return () => {
            // Cleanup subscriptions
            Object.keys(events).forEach(event => {
                socketService.unsubscribe(event);
            });
            socketService.disconnect();
        };
    }, [connect, events]);

    return { connected, error, reconnect: connect };
}; 