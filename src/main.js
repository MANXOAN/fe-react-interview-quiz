import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppPractical.jsx';
import './style.css';

const mountNode = globalThis.document && globalThis.document.getElementById('root');

if (mountNode) {
  createRoot(mountNode).render(React.createElement(App));
}
