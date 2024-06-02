import React from 'react';
import { useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export default function ErrorPage({ error }) {
  // Hook to access the current location, which can contain error information
  const location = useLocation();

  // Determine the error object to use, either passed as a prop or from the location state
  const err = error || location.state?.error || { statusText: 'Unknown error', message: 'An unexpected error has occurred.' };


  // Extract relevant information from the error object
  const statusText = err?.statusText || 'Unknown error';
  const message = err?.message || 'An unexpected error has occurred.';
  const isNotFound = err?.status === 404 || message === 'Not Found';

  // Extract API-specific details if available
  const apiDetails = err?.response?.data || null;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Alert variant="danger">
        {isNotFound ? (
          <>
            <strong>404 - Page Not Found</strong>
            <p>The page you are looking for does not exist.</p>
          </>
        ) : (
          <>
            <strong>{statusText}</strong>
            <p>{message}</p>
            {/* Display detailed error information for debugging */}
            {apiDetails ? (
              <pre>{JSON.stringify(apiDetails, null, 2)}</pre>
            ) : (
              <pre>{JSON.stringify(err, null, 2)}</pre>
            )}
          </>
        )}
      </Alert>
    </div>
  );
}
