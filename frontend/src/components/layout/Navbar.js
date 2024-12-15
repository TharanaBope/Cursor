import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const NavigationBar = () => {
    const { user, logout } = useAuth();

    return (
        <Navbar bg="white" expand="lg" className="main-navbar">
            <Container>
                <Navbar.Brand href="/dashboard">
                    Ticket System
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user && (
                            <>
                                <span className="navbar-text me-3">
                                    Welcome, {user.username}
                                </span>
                                <Button 
                                    variant="outline-primary" 
                                    onClick={logout}
                                    className="logout-btn"
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar; 