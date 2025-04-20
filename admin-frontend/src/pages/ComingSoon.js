import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import BackButton from '../components/BackButton';

const ComingSoon = ({ feature }) => (
  <Container className="py-4">
    <BackButton />
    <h1 className="mb-4">{feature}</h1>
    <Alert variant="info">
      <h4>Coming Soon!</h4>
      <p>This feature is under development and will be available shortly.</p>
    </Alert>
  </Container>
);

export default ComingSoon; 