import React, { useState } from 'react';
import { Card, Row, Col, Button, ProgressBar, Alert } from 'react-bootstrap';
import { systemAPI } from '../../services/api';
import './SystemStatus.css';

const SystemStatus = ({ state }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        try {
            setError('');
            setLoading(true);
            const configId = localStorage.getItem('currentConfigId');
            if (!configId) {
                throw new Error('Please save configuration first');
            }
            await systemAPI.start(configId);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to start system');
            console.error('Failed to start system:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async () => {
        try {
            setError('');
            setLoading(true);
            await systemAPI.stop();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to stop system');
            console.error('Failed to stop system:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = () => {
        if (!state.ticketPool) return 0;
        return (state.ticketPool.available / state.ticketPool.capacity) * 100;
    };

    return (
        <div className="system-status">
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            
            <Row className="g-3">
                <Col md={6}>
                    <Card className="status-card">
                        <Card.Body>
                            <h5>Ticket Pool Status</h5>
                            <ProgressBar 
                                now={calculateProgress()} 
                                label={`${state.ticketPool?.available || 0} tickets`}
                                variant="info"
                            />
                            <div className="mt-2 text-muted">
                                Total Sold: {state.ticketPool?.totalSold || 0}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="status-card">
                        <Card.Body>
                            <h5>System Control</h5>
                            <div className="d-grid gap-2">
                                <Button
                                    variant={state.isRunning ? "danger" : "success"}
                                    onClick={state.isRunning ? handleStop : handleStart}
                                    disabled={loading}
                                >
                                    {loading ? "Please wait..." : (state.isRunning ? "Stop System" : "Start System")}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="status-card">
                        <Card.Body>
                            <h5>Producers</h5>
                            <div className="status-count">
                                Active: {state.producers?.filter(p => p.isRunning).length || 0}
                                <span className="text-muted"> / {state.producers?.length || 0}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="status-card">
                        <Card.Body>
                            <h5>Consumers</h5>
                            <div className="status-count">
                                Active: {state.consumers?.filter(c => c.isRunning).length || 0}
                                <span className="text-muted"> / {state.consumers?.length || 0}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SystemStatus;