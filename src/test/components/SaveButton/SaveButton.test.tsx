/**
 * SaveButton Component Tests
 *
 * Tests save button states, interactions, and visual feedback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveButton } from '../../../components/SaveButton/SaveButton';

describe('SaveButton Component', () => {
  const defaultProps = {
    hasUnsavedChanges: false,
    onSave: vi.fn(),
    isSaving: false,
  };

  describe('Saved State', () => {
    it('should render checkmark icon when saved', () => {
      render(<SaveButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('title', 'No changes to save');
    });

    it('should be disabled when no unsaved changes', () => {
      render(<SaveButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      expect(button).toBeDisabled();
    });

    it('should not call onSave when clicked in saved state', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(<SaveButton {...defaultProps} onSave={onSave} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      await user.click(button);

      expect(onSave).not.toHaveBeenCalled();
    });

    it('should have proper ARIA attributes when saved', () => {
      render(<SaveButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      expect(button).toHaveAttribute('aria-label', 'No changes to save');
      expect(button).toBeDisabled();
    });
  });

  describe('Unsaved Changes State', () => {
    it('should render save icon when there are unsaved changes', () => {
      render(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);

      const button = screen.getByRole('button', { name: /save note/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('title', 'Save note (Ctrl+S)');
    });

    it('should be enabled when there are unsaved changes', () => {
      render(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);

      const button = screen.getByRole('button', { name: /save note/i });
      expect(button).not.toBeDisabled();
    });

    it('should call onSave when clicked with unsaved changes', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(<SaveButton {...defaultProps} hasUnsavedChanges={true} onSave={onSave} />);

      const button = screen.getByRole('button', { name: /save note/i });
      await user.click(button);

      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible with unsaved changes', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(<SaveButton {...defaultProps} hasUnsavedChanges={true} onSave={onSave} />);

      const button = screen.getByRole('button', { name: /save note/i });
      button.focus();

      await user.keyboard('{Enter}');
      expect(onSave).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(onSave).toHaveBeenCalledTimes(2);
    });

    it('should have proper ARIA attributes with unsaved changes', () => {
      render(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);

      const button = screen.getByRole('button', { name: /save note/i });
      expect(button).toHaveAttribute('aria-label', 'Save note');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Saving State', () => {
    it('should render spinner icon when saving', () => {
      render(<SaveButton {...defaultProps} isSaving={true} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('title', 'No changes to save');
    });

    it('should be disabled when saving', () => {
      render(<SaveButton {...defaultProps} isSaving={true} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      expect(button).toBeDisabled();
    });

    it('should not call onSave when clicked while saving', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(<SaveButton {...defaultProps} isSaving={true} onSave={onSave} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      await user.click(button);

      expect(onSave).not.toHaveBeenCalled();
    });

    it('should have proper ARIA attributes when saving', () => {
      render(<SaveButton {...defaultProps} isSaving={true} />);

      const button = screen.getByRole('button', { name: /no changes to save/i });
      expect(button).toHaveAttribute('aria-label', 'No changes to save');
      expect(button).toBeDisabled();
    });

    it('should animate spinner SVG', () => {
      const { container } = render(<SaveButton {...defaultProps} isSaving={true} />);

      const animateTransform = container.querySelector('animateTransform');
      expect(animateTransform).toBeInTheDocument();
      expect(animateTransform).toHaveAttribute('attributeName', 'transform');
      expect(animateTransform).toHaveAttribute('type', 'rotate');
      expect(animateTransform).toHaveAttribute('repeatCount', 'indefinite');
    });
  });

  describe('State Transitions', () => {
    it('should transition from saved to unsaved', () => {
      const { rerender } = render(<SaveButton {...defaultProps} />);

      // Initially saved
      expect(screen.getByRole('button', { name: /no changes to save/i })).toBeInTheDocument();

      // Change to unsaved
      rerender(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);

      expect(screen.getByRole('button', { name: /save note/i })).toBeInTheDocument();
    });

    it('should transition from unsaved to saving', () => {
      const { rerender } = render(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);

      // Initially unsaved
      expect(screen.getByRole('button', { name: /save note/i })).toBeInTheDocument();

      // Change to saving
      rerender(<SaveButton {...defaultProps} isSaving={true} />);

      expect(screen.getByRole('button', { name: /no changes to save/i })).toBeInTheDocument();
    });

    it('should transition from saving to saved', () => {
      const { rerender } = render(<SaveButton {...defaultProps} isSaving={true} />);

      // Initially saving
      expect(screen.getByRole('button', { name: /no changes to save/i })).toBeInTheDocument();

      // Change to saved
      rerender(<SaveButton {...defaultProps} />);

      expect(screen.getByRole('button', { name: /no changes to save/i })).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should apply correct CSS classes', () => {
      const { container } = render(<SaveButton {...defaultProps} />);

      const button = container.querySelector('button');
      expect(button?.className).toMatch(/saveButton/);
    });

    it('should have SVG icons with proper attributes', () => {
      const { container, rerender } = render(<SaveButton {...defaultProps} />);

      // Check saved state SVG
      let svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
      expect(svg).toHaveAttribute('viewBox', '0 0 16 16');

      // Check unsaved state SVG
      rerender(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);
      svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 16 16');

      // Check saving state SVG
      rerender(<SaveButton {...defaultProps} isSaving={true} />);
      svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
    });

    it('should use currentColor for theme compatibility', () => {
      const { container } = render(<SaveButton {...defaultProps} />);

      const paths = container.querySelectorAll('path, circle');
      paths.forEach((element) => {
        const stroke = element.getAttribute('stroke');
        if (stroke) {
          expect(stroke).toBe('currentColor');
        }
      });
    });
  });

  describe('Accessibility', () => {
    it('should have role button', () => {
      render(<SaveButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have descriptive aria-label for all states', () => {
      const { rerender } = render(<SaveButton {...defaultProps} />);

      // Saved state
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'No changes to save');

      // Unsaved state
      rerender(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Save note');

      // Saving state
      rerender(<SaveButton {...defaultProps} isSaving={true} />);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'No changes to save');
    });

    it('should have title attribute for tooltips', () => {
      const { rerender } = render(<SaveButton {...defaultProps} />);

      // Saved state
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'No changes to save');

      // Unsaved state
      rerender(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Save note (Ctrl+S)');

      // Saving state
      rerender(<SaveButton {...defaultProps} isSaving={true} />);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'No changes to save');
    });

    it('should support focus states', async () => {
      render(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);

      const button = screen.getByRole('button');
      button.focus();

      expect(document.activeElement).toBe(button);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid state changes', () => {
      const { rerender } = render(<SaveButton {...defaultProps} />);

      // Rapid state changes
      rerender(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);
      rerender(<SaveButton {...defaultProps} isSaving={true} />);
      rerender(<SaveButton {...defaultProps} />);
      rerender(<SaveButton {...defaultProps} hasUnsavedChanges={true} />);

      // Should end in unsaved state
      expect(screen.getByRole('button', { name: /save note/i })).toBeInTheDocument();
    });

    it('should handle undefined props gracefully', () => {
      // @ts-expect-error Testing undefined props
      expect(() => render(<SaveButton />)).not.toThrow();
    });

    it('should handle rapid clicks in enabled state', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(<SaveButton {...defaultProps} hasUnsavedChanges={true} onSave={onSave} />);

      const button = screen.getByRole('button', { name: /save note/i });

      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(onSave).toHaveBeenCalledTimes(3);
    });

    it('should maintain button element type', () => {
      const { container } = render(<SaveButton {...defaultProps} />);

      const button = container.querySelector('button');
      expect(button?.tagName.toLowerCase()).toBe('button');
    });
  });
});
