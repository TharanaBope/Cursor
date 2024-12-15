import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import './ConfigPresets.css';

const presets = {
    small: {
        numProducers: 2,
        numConsumers: 2,
        totalTickets: 50,
        ticketReleaseRate: 1000,
        customerRetrievalRate: 1500,
        maxTicketCapacity: 20
    },
    medium: {
        numProducers: 4,
        numConsumers: 4,
        totalTickets: 100,
        ticketReleaseRate: 800,
        customerRetrievalRate: 1200,
        maxTicketCapacity: 40
    },
    large: {
        numProducers: 6,
        numConsumers: 6,
        totalTickets: 200,
        ticketReleaseRate: 500,
        customerRetrievalRate: 1000,
        maxTicketCapacity: 60
    }
};

const ConfigPresets = ({ onSelect }) => (
    <div className="config-presets">
        <h6>Quick Setup</h6>
        <ButtonGroup>
            {Object.entries(presets).map(([key, config]) => (
                <Button
                    key={key}
                    variant="outline-primary"
                    onClick={() => onSelect(config)}
                >
                    {key.charAt(0).toUpperCase() + key.slice(1)} System
                </Button>
            ))}
        </ButtonGroup>
    </div>
);

export default ConfigPresets; 