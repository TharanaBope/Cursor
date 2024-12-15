import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { configAPI } from '../../services/api';
import './ConfigForm.css';

const ConfigForm = () => {
    const [config, setConfig] = useState({
        numProducers: 2,
        numConsumers: 3,
        totalTickets: 100,
        ticketReleaseRate: 1000,
        customerRetrievalRate: 1500,
        maxTicketCapacity: 50
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setSuccess('');
            setLoading(true);
            const response = await configAPI.create(config);
            setSuccess('Configuration saved successfully!');
            // Store the config ID for system start
            localStorage.setItem('currentConfigId', response.data.id);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
    };

    return (
        <Form onSubmit={handleSubmit} className="config-form">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form.Group className="mb-3">
                <Form.Label>Number of Producers</Form.Label>
                <Form.Control
                    type="number"
                    name="numProducers"
                    value={config.numProducers}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Number of Consumers</Form.Label>
                <Form.Control
                    type="number"
                    name="numConsumers"
                    value={config.numConsumers}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Total Tickets</Form.Label>
                <Form.Control
                    type="number"
                    name="totalTickets"
                    value={config.totalTickets}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ticket Release Rate (ms)</Form.Label>
                <Form.Control
                    type="number"
                    name="ticketReleaseRate"
                    value={config.ticketReleaseRate}
                    onChange={handleChange}
                    min="100"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Customer Retrieval Rate (ms)</Form.Label>
                <Form.Control
                    type="number"
                    name="customerRetrievalRate"
                    value={config.customerRetrievalRate}
                    onChange={handleChange}
                    min="100"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Maximum Ticket Capacity</Form.Label>
                <Form.Control
                    type="number"
                    name="maxTicketCapacity"
                    value={config.maxTicketCapacity}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </Form.Group>

            <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="w-100"
            >
                {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
        </Form>
    );
};

export default ConfigForm;