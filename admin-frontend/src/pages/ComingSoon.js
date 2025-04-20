import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

const ComingSoon = ({ feature }) => (
  <Container className="py-5 text-center">
    <h1 className="mb-4">{feature}</h1>
    <Alert variant="info">
      <h4>Coming Soon!</h4>
      <p>This feature is under development and will be available shortly.</p>
    </Alert>
    <Button 
      variant="primary"
      className="mt-3"
      onClick={() => window.history.back()}
    >
      Go Back
    </Button>
  </Container>
);

export default ComingSoon; 