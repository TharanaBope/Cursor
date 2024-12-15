import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect() {
        this.socket = io('http://localhost:5001', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });
    }

    subscribe(event, callback) {
        if (!this.socket) this.connect();
        this.socket.on(event, callback);
        this.listeners.set(event, callback);
    }

    unsubscribe(event) {
        if (this.socket && this.listeners.has(event)) {
            this.socket.off(event, this.listeners.get(event));
            this.listeners.delete(event);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();