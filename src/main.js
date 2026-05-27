import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppAppend.jsx';
import './style.css';

const mountNode = document.getElementById('root');
createRoot(mountNode).render(React.createElement(App));
