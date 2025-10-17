import { FC } from 'react';
import { FileTree } from './components/FileTree/FileTree';
import { FeatureFlagDemo } from './components/FeatureFlagDemo';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

/**
 * Main App component - Phase 1 MVP
 * Basic structure with FileTree component and theme system
 */
export const App: FC = () => {
  return (
    <ThemeProvider>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text)',
        }}
      >
        <aside
          style={{
            width: '250px',
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >
          <FileTree />
        </aside>
        <main
          style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <div>
            <h1>Zenoter - Phase 1 MVP</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Modern note-taking app for developers
            </p>
          </div>

          <div style={{ marginTop: '40px' }}>
            <FeatureFlagDemo />
          </div>
        </main>
      </div>
      <ThemeToggle />
    </ThemeProvider>
  );
};
