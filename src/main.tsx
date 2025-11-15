import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Navigation from './Navigation.tsx';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navigation />
  </StrictMode>
);
