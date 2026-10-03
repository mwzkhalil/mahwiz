import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (typeof window.matchMedia === 'function') {
  document.documentElement.dataset.motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'full';
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
