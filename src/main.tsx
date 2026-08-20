import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeFavicon } from './lib/favicon.ts';

// Initialize the official Apex Syndicate "AS" diamond favicon in browser tab
initializeFavicon();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

