/**
 * Types for NoteEditor component
 */

export interface NoteEditorProps {
  /** The content to display in the editor */
  value: string;
  /** Callback when content changes */
  onChange: (value: string) => void;
  /** Optional language mode (default: markdown) */
  language?: string;
  /** Optional height (default: 100%) */
  height?: string;
  /** Optional class name for custom styling */
  className?: string;
  /** Optional loading text */
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
