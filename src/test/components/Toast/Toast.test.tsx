/**
 * Tests for Toast Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '../../../components/Toast';

describe('Toast Component', () => {
  it('should render with success type', () => {
    const handleClose = vi.fn();
    render(<Toast message="Operation successful" type="success" onClose={handleClose} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('should render with error type', () => {
    const handleClose = vi.fn();
    render(<Toast message="Operation failed" type="error" onClose={handleClose} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Operation failed')).toBeInTheDocument();
  });

  it('should render with info type', () => {
    const handleClose = vi.fn();
    render(<Toast message="Information message" type="info" onClose={handleClose} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Information message')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<Toast message="Test message" type="info" onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-dismiss after duration', async () => {
    const handleClose = vi.fn();

    render(
      <Toast
        message="Auto-dismiss message"
        type="success"
        onClose={handleClose}
        duration={100} // Short duration for testing
      />
    );

    expect(handleClose).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 200 }
    );
  });

  it('should have proper ARIA attributes', () => {
    const handleClose = vi.fn();

    render(<Toast message="Test message" type="success" onClose={handleClose} />);

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });
});
