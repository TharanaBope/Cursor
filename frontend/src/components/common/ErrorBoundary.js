import React from 'react';
import { Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <Alert variant="danger">
                        <Alert.Heading>Something went wrong</Alert.Heading>
                        <p>
                            {this.state.error?.message || 
                             'An unexpected error occurred. Please try again.'}
                        </p>
                        <Button 
                            variant="outline-danger"
                            onClick={this.handleReset}
                        >
                            Reset Application
                        </Button>
                    </Alert>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 