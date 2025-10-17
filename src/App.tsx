import { FC } from 'react';
import { FileTree } from './components/FileTree/FileTree';
import { FeatureFlagDemo } from './components/FeatureFlagDemo';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import styles from './App.module.css';

/**
 * Main App component - Phase 1 MVP
 * Basic structure with FileTree component and theme system
 */
export const App: FC = () => {
  return (
    <ThemeProvider>
      <div className={styles.appContainer}>
        <aside className={styles.sidebar}>
          <FileTree />
        </aside>
        <main className={styles.mainContent}>
          <div>
            <h1>Zenoter - Phase 1 MVP</h1>
            <p className={styles.subtitle}>Modern note-taking app for developers</p>
          </div>

          <div className={styles.demoSection}>
            <FeatureFlagDemo />
          </div>
        </main>
      </div>
      <ThemeToggle />
    </ThemeProvider>
  );
};
