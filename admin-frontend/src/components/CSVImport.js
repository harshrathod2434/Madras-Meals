import React, { useState } from 'react';
import { Button, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { menuService } from '../services/api';

const CSVImport = ({ onImportSuccess }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file');
      return;
    }
    setCsvFile(file);
    setError('');
  };

  const handleDownloadTemplate = async () => {
    try {
      setError('');
      const downloadBtn = document.querySelector('[data-download-template]');
      if (downloadBtn) downloadBtn.disabled = true;
      
      await menuService.getCSVTemplate();
      setSuccess('Template downloaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error downloading template:', err);
      setError('Failed to download CSV template. Please try again.');
    } finally {
      const downloadBtn = document.querySelector('[data-download-template]');
      if (downloadBtn) downloadBtn.disabled = false;
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    
    if (!csvFile) {
      setError('Please select a CSV file to import');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await menuService.importMenuItemsFromCSV(csvFile);
      console.log('Import response:', response);
      
      const importCount = response.data.items.length;
      setSuccess(`Successfully imported ${importCount} menu items!`);
      
      // Reset the file input
      e.target.reset();
      setCsvFile(null);
      
      // Notify parent component
      if (onImportSuccess) {
        onImportSuccess(response.data.items);
      }
    } catch (err) {
      console.error('Import error:', err);
      
      // Handle validation errors
      if (err.response?.data?.details) {
        const errorDetails = Array.isArray(err.response.data.details) 
          ? err.response.data.details.join(', ')
          : JSON.stringify(err.response.data.details);
        setError(`Import failed: ${err.response.data.error}. ${errorDetails}`);
      } else {
        setError(err.response?.data?.error || 'Failed to import CSV file');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Import Menu Items from CSV</Card.Header>
      <Card.Body>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <p>Upload a CSV file to import multiple menu items at once. The CSV should have the following columns:</p>
        <ul className="mb-3">
          <li><strong>name</strong> - Item name (required)</li>
          <li><strong>description</strong> - Item description (required)</li>
          <li><strong>price</strong> - Item price (required, must be a positive number)</li>
          <li><strong>category</strong> - Item category (optional, must be one of: appetizer, main course, dessert, beverage)</li>
          <li><strong>isAvailable</strong> - Item availability (optional, default is true)</li>
          <li><strong>image</strong> - Item image URL (optional)</li>
        </ul>
        
        <Form onSubmit={handleImport}>
          <Form.Group className="mb-3">
            <Form.Label>CSV File</Form.Label>
            <Form.Control 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              disabled={isUploading} 
              required 
            />
            <Form.Text className="text-muted">
              Select a CSV file to import menu items
            </Form.Text>
          </Form.Group>
          
          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={handleDownloadTemplate} 
              disabled={isUploading}
              data-download-template
            >
              <i className="bi bi-download me-1"></i> Download Template
            </Button>
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isUploading || !csvFile}
            >
              {isUploading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Importing...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-1"></i> Import Items
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CSVImport; 