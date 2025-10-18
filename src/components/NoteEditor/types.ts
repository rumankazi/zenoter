/**
 * Types for NoteEditor component
 */

export interface NoteEditorProps {
  /** Current note content */
  value: string;
  /** Callback when content changes */
  onChange: (value: string) => void;
  /** Callback when editor scrolls or cursor moves */
  onScroll?: (scrollPercentage: number) => void;
  /** Editor language (default: 'markdown') */
  language?: string;
  /** Editor height (default: '100%') */
  height?: string;
  /** Optional CSS class */
  className?: string;
  /** Loading text */
  loading?: string;
}

export interface EditorOptions {
  /** Enable minimap */
  minimap?: { enabled: boolean };
  /** Font size */
  fontSize?: number;
  /** Line numbers display */
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  /** Word wrap */
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  /** Enable automatic layout */
  automaticLayout?: boolean;
  /** Enable smooth scrolling */
  smoothScrolling?: boolean;
  /** Cursor style */
  cursorStyle?: 'line' | 'block' | 'underline';
  /** Cursor blinking */
  cursorBlinking?: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
}
