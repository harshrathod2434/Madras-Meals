import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';

const BackButton = ({ to = '/dashboard', label = 'Back to Dashboard' }) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline-secondary" 
      className="mb-3" 
      onClick={() => navigate(to)}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        marginLeft: '0',
        position: 'relative',
        left: '-0.5rem'
      }}
    >
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
};

export default BackButton; 