import React from 'react';
import InvoiceForm from './components/InvoiceForm';
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="lg">
        <h1>Invoice Generator</h1>
        <InvoiceForm />
      </Container>
    </React.Fragment>
  );
}

export default App;
