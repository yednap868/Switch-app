import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode can double-invoke effects in dev and make the UI feel laggy.
  // For this production-like demo, we render without it for smoother swipes.
  <App />
);

