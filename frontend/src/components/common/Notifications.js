import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import './Notifications.css';

const Notifications = ({ notifications, onDismiss }) => (
    <ToastContainer position="top-end" className="notifications-container">
        {notifications.map(notification => (
            <Toast 
                key={notification.id}
                onClose={() => onDismiss(notification.id)}
                show={true}
                delay={3000}
                autohide
            >
                <Toast.Header>
                    <strong className="me-auto">{notification.title}</strong>
                </Toast.Header>
                <Toast.Body>{notification.message}</Toast.Body>
            </Toast>
        ))}
    </ToastContainer>
);

export default Notifications; 