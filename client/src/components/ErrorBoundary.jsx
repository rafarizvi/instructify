import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Initialize state to track if an error has occurred, and store error details
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // This lifecycle method is invoked after an error has been thrown by a descendant component
  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred, triggering the fallback UI
    return { hasError: true, error };
  }

  // This lifecycle method is called after an error is thrown in a descendant component
  componentDidCatch(error, errorInfo) {
    // Send the error to Sentry for tracking and reporting
    Sentry.captureException(error);

    // Log the error to the console (or send it to an error reporting service)
    console.error("ErrorBoundary caught an error", error, errorInfo);

    // Update state to store error information
    this.setState({ errorInfo });
  }

  // Render method to display the fallback UI if an error has occurred
  render() {
    if (this.state.hasError) {
      // Render a custom fallback UI when an error is caught
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <Alert variant="danger">
            {/* Display the error message */}
            <p>{this.state.error && this.state.error.toString()}</p>
            {/* Display the component stack trace */}
            <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
          </Alert>
        </div>
      );
    }

    // Render the child components if no error has occurred
    return this.props.children; 
  }
}

export default ErrorBoundary;
