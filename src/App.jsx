import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppRoutes } from './routes/AppRoutes';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App runtime error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '500px', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>NexaCare VSMS Notice</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              The application encountered a display sync issue. Clearing the local cache will restore all portals.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  try { localStorage.clear(); sessionStorage.clear(); } catch(e) {}
                  window.location.href = '/';
                }}
                style={{ padding: '0.6rem 1.25rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Reset & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
