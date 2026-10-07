import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { PAGES, NOT_FOUND, findPage } from './content/pages.js';
import { buildHead } from './content/head.js';
import { SITE } from './content/site.js';

export { PAGES, NOT_FOUND, SITE };

export function render(path) {
  const page = path === NOT_FOUND.path ? NOT_FOUND : findPage(path);
  const html = renderToString(
    <React.StrictMode>
      <App path={page.path} />
    </React.StrictMode>
  );
  return { html, head: buildHead(page), page };
}
