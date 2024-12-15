import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ConfigForm from '../config/ConfigForm';
import TicketGraph from '../monitoring/TicketGraph';
import ActivityLog from '../monitoring/ActivityLog';
import SystemStatus from '../monitoring/SystemStatus';
import socketService from '../../services/socket';
import './Dashboard.css';

const Dashboard = () => {
    const [systemState, setSystemState] = useState({
        isRunning: false,
        ticketPool: null,
        producers: [],
        consumers: []
    });

    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        socketService.connect();

        socketService.subscribe('systemState', (state) => {
            setSystemState(state);
            // Add new data point for the graph
            if (state.ticketPool) {
                setGraphData(prevData => [...prevData, {
                    timestamp: new Date(),
                    available: state.ticketPool.available,
                    sold: state.ticketPool.totalSold
                }].slice(-20)); // Keep only last 20 points
            }
        });

        return () => {
            socketService.disconnect();
        };
    }, []);

    return (
        <Container fluid className="dashboard-container">
            <Row className="dashboard-row">
                <Col md={4}>
                    <div className="config-section">
                        <Card className="dashboard-card h-100">
                            <Card.Body>
                                <h4 className="card-title">Configuration</h4>
                                <ConfigForm />
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
                <Col md={8}>
                    <div className="status-section">
                        <Card className="dashboard-card h-100">
                            <Card.Body>
                                <h4 className="card-title">System Status</h4>
                                <SystemStatus state={systemState} />
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
            <Row className="dashboard-row">
                <Col md={8}>
                    <div className="monitoring-section">
                        <Card className="dashboard-card h-100">
                            <Card.Body>
                                <h4 className="card-title">Real-time Monitoring</h4>
                                <TicketGraph data={graphData} />
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="monitoring-section">
                        <Card className="dashboard-card h-100">
                            <Card.Body>
                                <h4 className="card-title">Activity Log</h4>
                                <ActivityLog />
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;