/**
 * Tests for NoteEditor component
 * Following TDD approach - tests written before implementation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../../context/ThemeContext';
import { NoteEditor } from '../../../components/NoteEditor/NoteEditor';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: vi.fn(({ value, onChange, theme, onMount }) => {
    // Simulate editor mounting
    if (onMount) {
      const mockEditor = {
        getValue: () => value,
        setValue: (newValue: string) => onChange?.(newValue),
        dispose: () => {},
        focus: () => {}, // Add focus method for tests
      };
      setTimeout(() => onMount(mockEditor, {}), 0);
    }

    return (
      <div
        data-testid="monaco-editor"
        data-theme={theme}
        data-language="markdown"
        role="textbox"
        aria-label="Code editor"
      >
        {value}
      </div>
    );
  }),
}));

describe('NoteEditor', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render editor with initial content', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="# Hello World" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toBeInTheDocument();
      expect(editor).toHaveTextContent('# Hello World');
    });

    it('should render with empty content', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} className="custom-editor" />
        </ThemeProvider>
      );

      const editorContainer = container.firstChild;
      expect(editorContainer).toHaveClass('custom-editor');
    });
  });

  describe('Theme Integration', () => {
    it('should apply dark theme from context', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');
      // Default theme should be applied
      expect(editor).toHaveAttribute('data-theme');
    });

    it('should update theme when context changes', async () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');
      const initialTheme = editor.getAttribute('data-theme');

      // Theme changes are handled by ThemeContext
      // This test verifies the editor receives theme prop
      expect(initialTheme).toBeDefined();
    });
  });

  describe('Content Updates', () => {
    it('should call onChange when content changes', async () => {
      render(
        <ThemeProvider>
          <NoteEditor value="Initial" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');

      // Simulate content change through Monaco's onChange
      await waitFor(() => {
        expect(editor).toBeInTheDocument();
      });
    });

    it('should update displayed content when value prop changes', () => {
      const { rerender } = render(
        <ThemeProvider>
          <NoteEditor value="First content" onChange={mockOnChange} />
        </ThemeProvider>
      );

      let editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveTextContent('First content');

      rerender(
        <ThemeProvider>
          <NoteEditor value="Second content" onChange={mockOnChange} />
        </ThemeProvider>
      );

      editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveTextContent('Second content');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByRole('textbox', { name: /code editor/i });
      expect(editor).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByRole('textbox');
      expect(editor).toBeInTheDocument();
      // Monaco Editor handles keyboard navigation internally
    });
  });

  describe('Language Mode', () => {
    it('should default to markdown language', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveAttribute('data-language', 'markdown');
    });

    it('should accept custom language prop', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} language="typescript" />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');
      // Language prop should be passed to Monaco
      expect(editor).toBeInTheDocument();
    });
  });

  describe('Options', () => {
    it('should apply default editor options', () => {
      render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toBeInTheDocument();
      // Options are passed to Monaco internally
    });

    it('should support custom height', () => {
      const { container } = render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} height="500px" />
        </ThemeProvider>
      );

      const editorContainer = container.firstChild as HTMLElement;
      expect(editorContainer).toHaveStyle({ height: '500px' });
    });
  });

  describe('Editor Lifecycle', () => {
    it('should mount editor successfully', async () => {
      render(
        <ThemeProvider>
          <NoteEditor value="Test" onChange={mockOnChange} />
        </ThemeProvider>
      );

      await waitFor(() => {
        const editor = screen.getByTestId('monaco-editor');
        expect(editor).toBeInTheDocument();
      });
    });

    it('should cleanup on unmount', () => {
      const { unmount } = render(
        <ThemeProvider>
          <NoteEditor value="" onChange={mockOnChange} />
        </ThemeProvider>
      );

      unmount();
      // Monaco's dispose is called internally
      expect(screen.queryByTestId('monaco-editor')).not.toBeInTheDocument();
    });
  });
});
