import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const statusText = error?.statusText || 'Unknown error';
  const message = error?.message || 'An unexpected error has occurred.';
  const details = error?.details || JSON.stringify(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Alert variant="danger">
        <strong>{statusText}</strong>
        <p>{message}</p>
        {details && <pre>{details}</pre>}
      </Alert>
    </div>
  );
}
