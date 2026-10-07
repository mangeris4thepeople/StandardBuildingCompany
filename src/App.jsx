import React from 'react';
import { findPage } from './content/pages.js';
import { Nav, Footer, MobileBar } from './components/Layout.jsx';
import {
  HomePage,
  HubPage,
  ServicePage,
  AreasPage,
  AreaPage,
  ContactPage,
  NotFoundPage,
} from './components/Pages.jsx';

const VIEWS = {
  home: HomePage,
  hub: HubPage,
  service: ServicePage,
  areas: AreasPage,
  area: AreaPage,
  contact: ContactPage,
  notfound: NotFoundPage,
};

// The site is a set of prerendered pages. Links are plain anchors, each page is its own
// HTML file, and React hydrates whichever page was served.
export default function App({ path = '/' }) {
  const page = findPage(path);
  const View = VIEWS[page.type];
  return (
    <>
      <Nav solid={page.type !== 'home'} current={page.path} />
      <main>
        <View page={page} />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
