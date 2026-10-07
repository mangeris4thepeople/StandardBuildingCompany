import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/barlow/latin-400.css';
import '@fontsource/barlow/latin-500.css';
import '@fontsource/barlow/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-900.css';
import './App.css';
import App from './App.jsx';
import { findPage } from './content/pages.js';
import { initLinkTracking } from './track.js';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App path={window.location.pathname} />
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  // Production: the HTML was prerendered at build time, so attach to it.
  hydrateRoot(container, app);
} else {
  // Dev server: nothing was prerendered, so render from scratch.
  document.title = findPage(window.location.pathname).title;
  createRoot(container).render(app);
}

initLinkTracking();
