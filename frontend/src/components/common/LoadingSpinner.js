import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading...' }) => (
    <div className="loading-spinner">
        <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">{text}</span>
        </Spinner>
        <p className="loading-text">{text}</p>
    </div>
);

export default LoadingSpinner; 