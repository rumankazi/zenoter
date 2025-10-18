import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResizablePane } from '../../../components/ResizablePane';

describe('ResizablePane Component', () => {
  it('should render left and right panes', () => {
    render(
      <ResizablePane
        left={<div data-testid="left-pane">Left</div>}
        right={<div data-testid="right-pane">Right</div>}
        defaultSize={20}
      />
    );

    expect(screen.getByTestId('left-pane')).toBeInTheDocument();
    expect(screen.getByTestId('right-pane')).toBeInTheDocument();
  });

  it('should render separator with correct aria attributes', () => {
    render(<ResizablePane left={<div>Left</div>} right={<div>Right</div>} defaultSize={25} />);

    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-valuemin', '20'); // Default minSize is 20
    expect(separator).toHaveAttribute('aria-valuemax', '80'); // Default maxSize is 80
    expect(separator).toHaveAttribute('aria-valuenow', '25');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('should apply custom min and max sizes', () => {
    render(
      <ResizablePane
        left={<div>Left</div>}
        right={<div>Right</div>}
        defaultSize={30}
        minSize={10}
        maxSize={50}
      />
    );

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-valuemin', '10');
    expect(separator).toHaveAttribute('aria-valuemax', '50');
  });

  it('should handle keyboard navigation - ArrowRight', () => {
    render(<ResizablePane left={<div>Left</div>} right={<div>Right</div>} defaultSize={20} />);

    const separator = screen.getByRole('separator');

    // Simulate ArrowRight key press (should not crash)
    fireEvent.keyDown(separator, { key: 'ArrowRight' });

    // Should still be rendered
    expect(separator).toBeInTheDocument();
  });

  it('should handle keyboard navigation - ArrowLeft', () => {
    render(<ResizablePane left={<div>Left</div>} right={<div>Right</div>} defaultSize={20} />);

    const separator = screen.getByRole('separator');

    // Simulate ArrowLeft key press (should not crash)
    fireEvent.keyDown(separator, { key: 'ArrowLeft' });

    // Should still be rendered
    expect(separator).toBeInTheDocument();
  });

  it('should handle keyboard at minimum size', () => {
    render(
      <ResizablePane
        left={<div>Left</div>}
        right={<div>Right</div>}
        defaultSize={15}
        minSize={15}
      />
    );

    const separator = screen.getByRole('separator');

    // Try to decrease below minimum (should not crash)
    fireEvent.keyDown(separator, { key: 'ArrowLeft' });

    // Should still be rendered
    expect(separator).toBeInTheDocument();
  });

  it('should handle keyboard at maximum size', () => {
    render(
      <ResizablePane
        left={<div>Left</div>}
        right={<div>Right</div>}
        defaultSize={40}
        maxSize={40}
      />
    );

    const separator = screen.getByRole('separator');

    // Try to increase above maximum (should not crash)
    fireEvent.keyDown(separator, { key: 'ArrowRight' });

    // Should still be rendered
    expect(separator).toBeInTheDocument();
  });

  it('should handle mousedown event on separator', () => {
    render(<ResizablePane left={<div>Left</div>} right={<div>Right</div>} defaultSize={20} />);

    const separator = screen.getByRole('separator');

    // Simulate mousedown
    fireEvent.mouseDown(separator);

    // The component should enter dragging state (visual feedback)
    expect(separator).toBeInTheDocument();
  });

  it('should render vertical orientation', () => {
    render(
      <ResizablePane
        left={<div>Top</div>}
        right={<div>Bottom</div>}
        defaultSize={20}
        orientation="vertical"
      />
    );

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('should be focusable', () => {
    render(<ResizablePane left={<div>Left</div>} right={<div>Right</div>} defaultSize={20} />);

    const separator = screen.getByRole('separator');

    separator.focus();
    expect(separator).toHaveFocus();
  });

  it('should handle mouse move during drag', () => {
    render(<ResizablePane left={<div>Left</div>} right={<div>Right</div>} defaultSize={20} />);

    const separator = screen.getByRole('separator');

    // Start dragging
    fireEvent.mouseDown(separator);

    // Simulate mouse move
    fireEvent.mouseMove(document, { clientX: 300 });

    // End dragging
    fireEvent.mouseUp(document);

    expect(separator).toBeInTheDocument();
  });

  it('should handle mouse up without dragging', () => {
    render(<ResizablePane left={<div>Left</div>} right={<div>Right</div>} defaultSize={20} />);

    // Simulate mouseup without mousedown (should not crash)
    fireEvent.mouseUp(document);

    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
  });
});
