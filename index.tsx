import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
    <Analytics />
  </React.StrictMode>
);