import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/AuthContext/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
    <Router>
      <App />
  </Router>
  </AuthProvider>
  </StrictMode>,
)
