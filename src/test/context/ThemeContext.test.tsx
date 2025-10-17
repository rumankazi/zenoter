import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Test component that uses the theme
const TestComponent = () => {
  const { mode, resolvedTheme, setMode, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="resolved">{resolvedTheme}</div>
      <button onClick={() => setMode('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setMode('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setMode('auto')} data-testid="set-auto">
        Set Auto
      </button>
      <button onClick={toggleTheme} data-testid="toggle">
        Toggle
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Mock matchMedia
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should default to auto mode', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('auto');
    });

    it('should resolve to light theme when system prefers light', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false, // System prefers light
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('resolved').textContent).toBe('light');
    });

    it('should resolve to dark theme when system prefers dark', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)', // System prefers dark
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('resolved').textContent).toBe('dark');
    });

    it('should read saved mode from localStorage', () => {
      localStorage.setItem('zenoter-theme-mode', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('dark');
      expect(screen.getByTestId('resolved').textContent).toBe('dark');
    });
  });

  describe('setMode', () => {
    it('should update mode to light', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('set-light').click();
      });

      expect(screen.getByTestId('mode').textContent).toBe('light');
      expect(screen.getByTestId('resolved').textContent).toBe('light');
    });

    it('should update mode to dark', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('set-dark').click();
      });

      expect(screen.getByTestId('mode').textContent).toBe('dark');
      expect(screen.getByTestId('resolved').textContent).toBe('dark');
    });

    it('should persist mode to localStorage', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('set-dark').click();
      });

      expect(localStorage.getItem('zenoter-theme-mode')).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from auto to dark when system is light', () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false, // System prefers light
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode').textContent).toBe('auto');
      expect(screen.getByTestId('resolved').textContent).toBe('light');

      act(() => {
        screen.getByTestId('toggle').click();
      });

      expect(screen.getByTestId('mode').textContent).toBe('dark');
      expect(screen.getByTestId('resolved').textContent).toBe('dark');
    });

    it('should toggle from light to dark', () => {
      localStorage.setItem('zenoter-theme-mode', 'light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('toggle').click();
      });

      expect(screen.getByTestId('mode').textContent).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      localStorage.setItem('zenoter-theme-mode', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('toggle').click();
      });

      expect(screen.getByTestId('mode').textContent).toBe('light');
    });
  });

  describe('system preference changes', () => {
    it('should update resolved theme when in auto mode and system changes', async () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false, // Start with light
        media: query,
        onchange: null,
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') changeHandler = handler;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('resolved').textContent).toBe('light');

      // Simulate system theme change
      if (changeHandler) {
        act(() => {
          changeHandler!({ matches: true } as MediaQueryListEvent);
        });
      }

      await waitFor(() => {
        expect(screen.getByTestId('resolved').textContent).toBe('dark');
      });
    });

    it('should not update when in manual mode (light)', async () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') changeHandler = handler;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Set to manual light mode
      act(() => {
        screen.getByTestId('set-light').click();
      });

      expect(screen.getByTestId('resolved').textContent).toBe('light');

      // Simulate system theme change to dark
      if (changeHandler) {
        act(() => {
          changeHandler!({ matches: true } as MediaQueryListEvent);
        });
      }

      // Should stay light (manual override)
      expect(screen.getByTestId('resolved').textContent).toBe('light');
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within ThemeProvider');

      consoleSpy.mockRestore();
    });
  });
});
