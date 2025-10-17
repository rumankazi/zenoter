import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ThemeToggle } from '../../../components/ThemeToggle/ThemeToggle';

const renderWithTheme = () => {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false, // Default to light mode
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('rendering', () => {
    it('should render the theme toggle button', () => {
      renderWithTheme();
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('should render as a toggle switch', () => {
      renderWithTheme();
      const button = screen.getByTestId('theme-toggle');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should have accessible label', () => {
      renderWithTheme();
      const button = screen.getByTestId('theme-toggle');
      const label = button.getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label).toContain('Switch to');
    });
  });

  describe('interactions', () => {
    it('should toggle from light to dark on click', async () => {
      localStorage.setItem('zenoter-theme-mode', 'light');
      renderWithTheme();
      const button = screen.getByTestId('theme-toggle');

      // Get initial state
      const initialLabel = button.getAttribute('aria-label');
      expect(initialLabel).toContain('dark'); // Should say "Switch to dark mode"

      // Click to toggle
      await userEvent.click(button);

      // Should now be in dark mode
      const newLabel = button.getAttribute('aria-label');
      expect(newLabel).toContain('light'); // Should say "Switch to light mode"
    });

    it('should toggle from dark to light on click', async () => {
      localStorage.setItem('zenoter-theme-mode', 'dark');
      renderWithTheme();
      const button = screen.getByTestId('theme-toggle');

      // Get initial state
      const initialLabel = button.getAttribute('aria-label');
      expect(initialLabel).toContain('light'); // Should say "Switch to light mode"

      // Click to toggle
      await userEvent.click(button);

      // Should now be in light mode
      const newLabel = button.getAttribute('aria-label');
      expect(newLabel).toContain('dark'); // Should say "Switch to dark mode"
    });

    it('should toggle between light and dark repeatedly', async () => {
      localStorage.setItem('zenoter-theme-mode', 'light');
      renderWithTheme();
      const button = screen.getByTestId('theme-toggle');

      // Start in light mode
      expect(button.getAttribute('aria-label')).toContain('dark');

      // Toggle to dark
      await userEvent.click(button);
      expect(button.getAttribute('aria-label')).toContain('light');

      // Toggle back to light
      await userEvent.click(button);
      expect(button.getAttribute('aria-label')).toContain('dark');

      // Toggle to dark again
      await userEvent.click(button);
      expect(button.getAttribute('aria-label')).toContain('light');
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label', () => {
      renderWithTheme();
      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toContain('Switch to');
    });

    it('should be keyboard accessible', async () => {
      localStorage.setItem('zenoter-theme-mode', 'light');
      renderWithTheme();
      const button = screen.getByTestId('theme-toggle');

      button.focus();
      expect(document.activeElement).toBe(button);

      const beforeLabel = button.getAttribute('aria-label');

      // Simulate Enter key
      await userEvent.keyboard('{Enter}');

      const afterLabel = button.getAttribute('aria-label');
      expect(afterLabel).not.toBe(beforeLabel);
    });
  });
});
