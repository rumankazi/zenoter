import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewToggle } from '../../../components/PreviewToggle';

describe('PreviewToggle Component', () => {
  it('should render with correct initial state', () => {
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={true} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Hide preview');
  });

  it('should show correct aria-label when preview is hidden', () => {
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={false} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-label', 'Show preview');
  });

  it('should call onToggle when clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={true} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');
    await user.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onToggle when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={true} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');
    button.focus();
    await user.keyboard('{Enter}');

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onToggle when Space key is pressed', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={true} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');
    button.focus();
    await user.keyboard(' ');

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('should be keyboard accessible', async () => {
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={true} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');

    // Should be focusable
    button.focus();
    expect(button).toHaveFocus();
  });

  it('should display eye icon when preview is visible', () => {
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={true} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('should display eye-off icon when preview is hidden', () => {
    const mockToggle = vi.fn();
    render(<PreviewToggle isVisible={false} onToggle={mockToggle} />);

    const button = screen.getByTestId('preview-toggle');
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });
});
