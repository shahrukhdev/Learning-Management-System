import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthProvider';
import { APP_NAME } from './utils/pageTitle';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      {/* Default browser title until/unless a page sets its own (via SEO) */}
      <Helmet defaultTitle={APP_NAME} />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
