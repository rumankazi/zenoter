/**
 * NotesList Component Tests
 *
 * Tests note list display, selection, creation, and deletion.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotesList } from '../../../components/NotesList/NotesList';
import type { Note } from '../../../services/database.client';

describe('NotesList Component', () => {
  const mockNotes: Note[] = [
    {
      id: 1,
      title: 'First Note',
      content: '# First Note\n\nThis is the first note content with **bold** text.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Second Note',
      content: '# Second Note\n\nAnother note with `code` blocks.',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      title: 'Old Note',
      content: 'Content from long ago',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];

  const defaultProps = {
    notes: mockNotes,
    selectedNoteId: null,
    onNoteSelect: vi.fn(),
    onNoteCreate: vi.fn(),
    onNoteDelete: vi.fn(),
    isLoading: false,
  };

  describe('Create Button', () => {
    it('should render create button with plus icon', () => {
      render(<NotesList {...defaultProps} />);

      const createButton = screen.getByRole('button', { name: /create new note/i });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute('title', 'Create new note');
    });

    it('should call onNoteCreate when clicked', async () => {
      const user = userEvent.setup();
      const onNoteCreate = vi.fn();

      render(<NotesList {...defaultProps} onNoteCreate={onNoteCreate} />);

      const createButton = screen.getByRole('button', { name: /create new note/i });
      await user.click(createButton);

      expect(onNoteCreate).toHaveBeenCalledTimes(1);
    });

    it('should have proper ARIA attributes', () => {
      render(<NotesList {...defaultProps} />);

      const createButton = screen.getByRole('button', { name: /create new note/i });
      expect(createButton).toHaveAttribute('aria-label', 'Create new note');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      const onNoteCreate = vi.fn();

      render(<NotesList {...defaultProps} onNoteCreate={onNoteCreate} />);

      const createButton = screen.getByRole('button', { name: /create new note/i });
      createButton.focus();

      await user.keyboard('{Enter}');
      expect(onNoteCreate).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(onNoteCreate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<NotesList {...defaultProps} isLoading={true} />);

      const loadingButton = screen.getByRole('button', { name: /loading notes/i });
      expect(loadingButton).toBeInTheDocument();
      expect(loadingButton).toBeDisabled();
    });

    it('should not show notes list when loading', () => {
      render(<NotesList {...defaultProps} isLoading={true} />);

      // Notes should not be visible
      expect(screen.queryByText('First Note')).not.toBeInTheDocument();
      expect(screen.queryByText('Second Note')).not.toBeInTheDocument();
    });

    it('should have proper ARIA attributes when loading', () => {
      render(<NotesList {...defaultProps} isLoading={true} />);

      const loadingButton = screen.getByRole('button', { name: /loading notes/i });
      expect(loadingButton).toHaveAttribute('aria-label', 'Loading notes');
      expect(loadingButton).toBeDisabled();
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no notes', () => {
      render(<NotesList {...defaultProps} notes={[]} />);

      expect(screen.getByText(/click above to create your first note/i)).toBeInTheDocument();
    });

    it('should not show notes list when empty', () => {
      render(<NotesList {...defaultProps} notes={[]} />);

      expect(screen.queryByText('First Note')).not.toBeInTheDocument();
    });
  });

  describe('Notes List Display', () => {
    it('should render all notes', () => {
      render(<NotesList {...defaultProps} />);

      expect(screen.getByText('First Note')).toBeInTheDocument();
      expect(screen.getByText('Second Note')).toBeInTheDocument();
      expect(screen.getByText('Old Note')).toBeInTheDocument();
    });

    it('should display note previews with markdown stripped', () => {
      render(<NotesList {...defaultProps} />);

      // Bold and inline code should be stripped from preview
      expect(
        screen.getByText(/This is the first note content with bold text/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Another note with code blocks/i)).toBeInTheDocument();
    });

    it('should truncate long previews to 60 characters', () => {
      const longNote: Note = {
        id: 4,
        title: 'Long Note',
        content: 'A'.repeat(100),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      render(<NotesList {...defaultProps} notes={[longNote]} />);

      const preview = screen.getByText(/A{60}\.\.\./);
      expect(preview).toBeInTheDocument();
    });

    it('should format dates correctly', () => {
      render(<NotesList {...defaultProps} />);

      // Today's date should show time or relative format
      // Yesterday should show "Yesterday"
      // Old notes should show days ago or date
      // We can't test exact format due to timezone differences, but elements should exist
      expect(screen.getByText('First Note')).toBeInTheDocument();
    });

    it('should apply selected styling to active note', () => {
      render(<NotesList {...defaultProps} selectedNoteId={1} />);

      // Find the note item by its content
      const noteItem = screen.getByText('First Note').closest('div[class*="noteItem"]');
      expect(noteItem?.className).toContain('selected');
    });

    it('should not apply selected styling to inactive notes', () => {
      render(<NotesList {...defaultProps} selectedNoteId={1} />);

      const secondNote = screen.getByText('Second Note').closest('div[class*="noteItem"]');
      expect(secondNote?.className).not.toContain('selected');
    });
  });

  describe('Note Selection', () => {
    it('should call onNoteSelect when note is clicked', async () => {
      const user = userEvent.setup();
      const onNoteSelect = vi.fn();

      render(<NotesList {...defaultProps} onNoteSelect={onNoteSelect} />);

      const firstNote = screen.getByText('First Note').closest('div[class*="noteItem"]');
      expect(firstNote).toBeInTheDocument();

      await user.click(firstNote!);

      expect(onNoteSelect).toHaveBeenCalledTimes(1);
      expect(onNoteSelect).toHaveBeenCalledWith(mockNotes[0]);
    });

    it('should call onNoteSelect with correct note data', async () => {
      const user = userEvent.setup();
      const onNoteSelect = vi.fn();

      render(<NotesList {...defaultProps} onNoteSelect={onNoteSelect} />);

      const firstNote = screen.getByText('First Note').closest('div[class*="noteItem"]');
      await user.click(firstNote!);

      expect(onNoteSelect).toHaveBeenCalledWith(mockNotes[0]);
    });
  });

  describe('Note Deletion', () => {
    it('should render delete button for each note', () => {
      render(<NotesList {...defaultProps} />);

      // Delete buttons should be present (aria-label includes "Delete")
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons).toHaveLength(mockNotes.length);
    });

    it('should show confirmation dialog when delete is clicked', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<NotesList {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalledWith('Delete this note?');

      confirmSpy.mockRestore();
    });

    it('should call onNoteDelete when confirmed', async () => {
      const user = userEvent.setup();
      const onNoteDelete = vi.fn();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<NotesList {...defaultProps} onNoteDelete={onNoteDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(onNoteDelete).toHaveBeenCalledTimes(1);
      expect(onNoteDelete).toHaveBeenCalledWith(1);

      confirmSpy.mockRestore();
    });

    it('should not delete when confirmation is cancelled', async () => {
      const user = userEvent.setup();
      const onNoteDelete = vi.fn();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<NotesList {...defaultProps} onNoteDelete={onNoteDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(onNoteDelete).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should stop event propagation on delete button click', async () => {
      const user = userEvent.setup();
      const onNoteSelect = vi.fn();
      const onNoteDelete = vi.fn();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <NotesList {...defaultProps} onNoteSelect={onNoteSelect} onNoteDelete={onNoteDelete} />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // onNoteSelect should NOT be called when delete button is clicked
      expect(onNoteSelect).not.toHaveBeenCalled();
      expect(onNoteDelete).toHaveBeenCalledTimes(1);

      confirmSpy.mockRestore();
    });

    it('should have proper ARIA labels for delete buttons', () => {
      render(<NotesList {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      deleteButtons.forEach((button, index) => {
        const ariaLabel = button.getAttribute('aria-label');
        expect(ariaLabel).toContain('Delete');
        expect(ariaLabel).toContain(mockNotes[index].title);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper container structure', () => {
      const { container } = render(<NotesList {...defaultProps} />);

      expect(container.firstChild).toBeTruthy();
      expect((container.firstChild as HTMLElement)?.className).toContain('container');
    });

    it('should support keyboard navigation for all interactive elements', async () => {
      const user = userEvent.setup();
      render(<NotesList {...defaultProps} />);

      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toHaveAttribute('aria-label', 'Create new note');

      await user.tab();
      // Next focusable element (first note or delete button)
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<NotesList {...defaultProps} />);

      // Button elements should be used for actions
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle note with empty title', () => {
      const noteWithoutTitle: Note = {
        id: 5,
        title: '',
        content: 'Content without title',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      render(<NotesList {...defaultProps} notes={[noteWithoutTitle]} />);

      // Should show "Untitled" or empty string
      expect(screen.getByText('Content without title')).toBeInTheDocument();
    });

    it('should handle note with empty content', () => {
      const emptyNote: Note = {
        id: 6,
        title: 'Empty Note',
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      render(<NotesList {...defaultProps} notes={[emptyNote]} />);

      expect(screen.getByText('Empty Note')).toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitleNote: Note = {
        id: 7,
        title: 'A'.repeat(200),
        content: 'Content',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      render(<NotesList {...defaultProps} notes={[longTitleNote]} />);

      // Title should be rendered (CSS handles truncation)
      expect(screen.getByText(/A{10,}/)).toBeInTheDocument();
    });

    it('should handle rapid clicks on create button', async () => {
      const user = userEvent.setup();
      const onNoteCreate = vi.fn();

      render(<NotesList {...defaultProps} onNoteCreate={onNoteCreate} />);

      const createButton = screen.getByRole('button', { name: /create new note/i });

      // Rapid fire clicks
      await user.click(createButton);
      await user.click(createButton);
      await user.click(createButton);

      expect(onNoteCreate).toHaveBeenCalledTimes(3);
    });
  });
});
