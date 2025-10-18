import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('App Component', () => {
  it('should render the application layout', () => {
    render(<App />);

    // Check if main structure is present
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display the note title in toolbar', () => {
    render(<App />);

    // Note title should be extracted from first line (# Welcome to Zenoter)
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe('Welcome to Zenoter');
  });

  it('should display welcome content in preview', () => {
    render(<App />);

    // Content from the initial note should be rendered in preview
    // Use getAllByText since title also has "Welcome to Zenoter"
    const welcomeElements = screen.getAllByText(/Welcome to Zenoter/i);
    expect(welcomeElements.length).toBeGreaterThanOrEqual(2); // Title + preview
  });

  it('should render FileTree component', () => {
    render(<App />);

    // FileTree renders with role="tree"
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('should extract title from first line of content when title is empty', () => {
    render(<App />);

    // Title should be extracted from "# Welcome to Zenoter" (without the #)
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe('Welcome to Zenoter');
  });

  it('should allow editing title on click', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click on title to edit
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    await user.click(titleElement);

    // Input should appear
    const input = screen.getByLabelText(/Edit note title/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('should save custom title on blur', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click on title to edit
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    await user.click(titleElement);

    // Type custom title
    const input = screen.getByLabelText(/Edit note title/i);
    await user.clear(input);
    await user.type(input, 'My Custom Note');

    // Blur to save
    await user.click(document.body);

    // Custom title should be displayed
    const updatedTitle = screen.getByRole('button', { name: /Note title - click to edit/i });
    expect(updatedTitle.textContent).toBe('My Custom Note');
  });

  it('should save title on Enter key press', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click on title to edit
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    await user.click(titleElement);

    // Type custom title
    const input = screen.getByLabelText(/Edit note title/i);
    await user.clear(input);
    await user.type(input, 'New Title');

    // Press Enter
    await user.keyboard('{Enter}');

    // Custom title should be displayed
    const updatedTitle = screen.getByRole('button', { name: /Note title - click to edit/i });
    expect(updatedTitle.textContent).toBe('New Title');
  });

  it('should cancel editing on Escape key press', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click on title to edit
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    await user.click(titleElement);

    // Type some text
    const input = screen.getByLabelText(/Edit note title/i);
    await user.type(input, 'Should not save');

    // Press Escape
    await user.keyboard('{Escape}');

    // Original title should still be displayed (extracted from content)
    const titleAfterEscape = screen.getByRole('button', { name: /Note title - click to edit/i });
    expect(titleAfterEscape.textContent).toBe('Welcome to Zenoter');
  });

  it('should fall back to first line when custom title is cleared', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click on title to edit
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    await user.click(titleElement);

    // Clear the input completely
    const input = screen.getByLabelText(/Edit note title/i);
    await user.clear(input);

    // Blur to save
    await user.click(document.body);

    // Should fall back to first line from content
    const titleAfterClear = screen.getByRole('button', { name: /Note title - click to edit/i });
    expect(titleAfterClear.textContent).toBe('Welcome to Zenoter');
  });

  it('should activate editing mode with Space key', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Focus on title and press Space
    const titleElement = screen.getByRole('button', { name: /Note title - click to edit/i });
    titleElement.focus();
    await user.keyboard(' ');

    // Input should appear
    const input = screen.getByLabelText(/Edit note title/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });
});
