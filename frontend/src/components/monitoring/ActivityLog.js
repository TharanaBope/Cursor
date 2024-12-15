import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import socketService from '../../services/socket';
import './ActivityLog.css';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);
    const containerRef = useRef(null);

    const scrollToBottom = () => {
        if (containerRef.current) {
            const { scrollHeight, clientHeight } = containerRef.current;
            containerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    useEffect(() => {
        const handleLog = (log) => {
            setLogs(prevLogs => {
                const newLogs = [...prevLogs, {
                    id: Date.now(),
                    ...log
                }];
                // Keep last 100 logs
                if (newLogs.length > 100) {
                    return newLogs.slice(-100);
                }
                return newLogs;
            });
        };

        socketService.subscribe('producerUpdate', (data) => {
            handleLog({
                type: 'PRODUCER',
                message: `Producer ${data.id} produced a ticket`,
                timestamp: new Date().toLocaleTimeString()
            });
        });

        socketService.subscribe('consumerUpdate', (data) => {
            handleLog({
                type: 'CONSUMER',
                message: `Consumer ${data.id} consumed a ticket`,
                timestamp: new Date().toLocaleTimeString()
            });
        });

        return () => {
            socketService.unsubscribe('producerUpdate');
            socketService.unsubscribe('consumerUpdate');
        };
    }, []);

    useEffect(scrollToBottom, [logs]);

    const getBadgeVariant = (type) => {
        switch (type) {
            case 'PRODUCER':
                return 'success';
            case 'CONSUMER':
                return 'warning';
            default:
                return 'info';
        }
    };

    return (
        <div className="activity-log-container">
            <div className="activity-log-wrapper" ref={containerRef} style={{ height: '300px', overflowY: 'auto' }}>
                <ListGroup variant="flush" className="log-list">
                    {logs.length === 0 ? (
                        <ListGroup.Item className="text-muted">
                            No activity yet. Start the system to see logs.
                        </ListGroup.Item>
                    ) : (
                        logs.map(log => (
                            <ListGroup.Item key={log.id} className="log-item">
                                <Badge bg={getBadgeVariant(log.type)} className="me-2">
                                    {log.type}
                                </Badge>
                                <span className="log-message">{log.message}</span>
                                <small className="text-muted ms-2">{log.timestamp}</small>
                            </ListGroup.Item>
                        ))
                    )}
                    <div ref={logEndRef} />
                </ListGroup>
            </div>
        </div>
    );
};

export default ActivityLog;