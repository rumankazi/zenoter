import { FC, useState } from 'react';
import { FileTree } from './components/FileTree/FileTree';
import { FeatureFlagDemo } from './components/FeatureFlagDemo';
import { ThemeToggle } from './components/ThemeToggle';
import { NoteEditor } from './components/NoteEditor';
import { ThemeProvider } from './context/ThemeContext';
import styles from './App.module.css';

/**
 * Main App component - Phase 1 MVP
 * Basic structure with FileTree, Monaco Editor, and theme system
 */
export const App: FC = () => {
  const [noteContent, setNoteContent] = useState<string>(
    '# Welcome to Zenoter\n\nA modern, animated note-taking app for developers.\n\n## Features\n\n- **Monaco Editor** - VS Code-like editing experience\n- **Markdown Support** - Full syntax highlighting\n- **IntelliSense** - Smart autocomplete\n- **Dark/Light Themes** - Toggle anytime\n\n## Try It Out\n\nStart typing markdown here! Try:\n- Headings with `#`\n- **Bold** with `**text**`\n- *Italic* with `*text*`\n- Code blocks with triple backticks\n\n```javascript\nconst greeting = () => {\n  console.log("Hello, Zenoter!");\n};\n```\n\n---\n\n**Sprint 1 Progress**: 95% Complete ✅'
  );

  return (
    <ThemeProvider>
      <div className={styles.appContainer} data-testid="app-container">
        <aside className={styles.sidebar}>
          <FileTree />
        </aside>
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Zenoter - Phase 1 MVP</h1>
            <p className={styles.subtitle}>Modern note-taking app for developers</p>
          </div>

          <div className={styles.editorSection}>
            <NoteEditor value={noteContent} onChange={setNoteContent} height="500px" />
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
