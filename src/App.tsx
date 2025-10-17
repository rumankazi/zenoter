import { FC } from 'react';
import { FileTree } from './components/FileTree/FileTree';

/**
 * Main App component - Phase 1 MVP
 * Basic structure with FileTree component
 */
export const App: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <aside
        style={{
          width: '250px',
          borderRight: '1px solid #e0e0e0',
          background: '#f5f5f5',
        }}
      >
        <FileTree />
      </aside>
      <main
        style={{
          flex: 1,
          padding: '2rem',
        }}
      >
        <h1>Zenoter - Phase 1 MVP</h1>
        <p>Modern note-taking app for developers</p>
      </main>
    </div>
  );
};
