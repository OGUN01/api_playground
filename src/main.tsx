import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Failed to find the root element');
    return;
  }

  // Clear any loading content
  rootElement.innerHTML = '';

  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});