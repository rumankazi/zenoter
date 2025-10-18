import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import type { Note } from '../services/database.client';

// Mock the database client
vi.mock('../services/database.client', () => {
  const mockNotes: Note[] = [
    {
      id: 1,
      title: 'Test Note 1',
      content: '# Test Note 1\n\nFirst test note content',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Test Note 2',
      content: '# Test Note 2\n\nSecond test note content',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  let resolveGetAllNotes: ((notes: Note[]) => void) | null = null;
  const getAllNotesPromise = new Promise<Note[]>((resolve) => {
    resolveGetAllNotes = resolve;
  });

  // Resolve immediately after a short delay to simulate async behavior
  setTimeout(() => resolveGetAllNotes?.(mockNotes), 0);

  return {
    databaseClient: {
      getAllNotes: vi.fn().mockImplementation(() => getAllNotesPromise),
      createNote: vi.fn().mockImplementation((data: { title: string; content: string }) =>
        Promise.resolve({
          id: 3,
          title: data.title,
          content: data.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      ),
      updateNote: vi.fn().mockResolvedValue(undefined),
      deleteNote: vi.fn().mockResolvedValue(undefined),
      getNoteById: vi.fn().mockResolvedValue(mockNotes[0]),
      searchNotes: vi.fn().mockResolvedValue(mockNotes),
    },
  };
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the application layout', () => {
    render(<App />);

    // Check if main structure is present
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should load notes on mount', async () => {
    const { databaseClient } = await import('../services/database.client');
    render(<App />);

    await waitFor(() => {
      expect(databaseClient.getAllNotes).toHaveBeenCalled();
    });
  });

  it('should display notes list in sidebar', () => {
    render(<App />);

    // NotesList component container should be present
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();

    // Notes list container should exist
    const notesContainer = sidebar.querySelector('[class*="container"]');
    expect(notesContainer).toBeTruthy();
  });

  it('should display create note button', async () => {
    render(<App />);

    // Wait for notes to load first
    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /create new note/i });
      expect(createButton).toBeInTheDocument();
    });
  });

  it('should display save button in toolbar', () => {
    render(<App />);

    // Save button should be present
    const saveButton = screen.getByRole('button', { name: /no changes to save|save note/i });
    expect(saveButton).toBeInTheDocument();
  });

  it('should display theme toggle', () => {
    render(<App />);

    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
  });

  it('should display preview toggle', () => {
    render(<App />);

    const previewToggle = screen.getByTestId('preview-toggle');
    expect(previewToggle).toBeInTheDocument();
  });

  it('should allow creating a new note', async () => {
    const user = userEvent.setup();
    const { databaseClient } = await import('../services/database.client');

    render(<App />);

    // Wait for initial notes to load
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create new note/i })).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /create new note/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(databaseClient.createNote).toHaveBeenCalled();
    });
  });

  it('should allow selecting a note', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Test Note 1').length).toBeGreaterThan(0);
    });

    // Get the note item from the sidebar (not the main editor title)
    const noteItems = screen.getAllByText('Test Note 1');
    const sidebarNoteTitle = noteItems.find(
      (el) => el.className.includes('noteTitle') && el.closest('[class*="noteItem"]')
    );

    expect(sidebarNoteTitle).toBeTruthy();
    const firstNote = sidebarNoteTitle?.closest('div[class*="noteItem"]');
    expect(firstNote).toBeInTheDocument();

    await user.click(firstNote!);

    // Note should remain selected (check for selected class)
    await waitFor(() => {
      expect(firstNote?.className).toContain('selected');
    });
  });

  it('should have proper ARIA structure', () => {
    render(<App />);

    // Sidebar should have complementary role
    expect(screen.getByRole('complementary')).toBeInTheDocument();

    // Main content should have main role
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render NoteEditor component', () => {
    const { container } = render(<App />);

    // Editor panes should be in the DOM
    const mainContent = container.querySelector('[class*="mainContent"]');
    expect(mainContent).toBeTruthy();
  });

  it('should render MarkdownPreview component', () => {
    render(<App />);

    // Preview container should be present
    const previewContainer = document.querySelector('[class*="previewContainer"]');
    expect(previewContainer).toBeInTheDocument();
  });
});
