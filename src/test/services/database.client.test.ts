/**
 * Database Client Service Tests
 *
 * Tests for renderer-side database operations wrapper.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatabaseClient, databaseClient, type Note } from '../../services/database.client';

describe('DatabaseClient', () => {
  let client: DatabaseClient;

  const mockNote: Note = {
    id: 1,
    title: 'Test Note',
    content: '# Test Content',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    client = DatabaseClient.getInstance();

    // Mock window.electron.db
    window.electron = {
      getVersion: vi.fn(),
      getPlatform: vi.fn(),
      db: {
        createNote: vi.fn(),
        getNoteById: vi.fn(),
        getAllNotes: vi.fn(),
        updateNote: vi.fn(),
        deleteNote: vi.fn(),
        searchNotes: vi.fn(),
      },
    };
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = DatabaseClient.getInstance();
      const instance2 = DatabaseClient.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should export a singleton instance', () => {
      expect(databaseClient).toBeInstanceOf(DatabaseClient);
      expect(databaseClient).toBe(DatabaseClient.getInstance());
    });
  });

  describe('createNote', () => {
    it('should call window.electron.db.createNote with correct input', async () => {
      const input = { content: '# New Note' };
      vi.mocked(window.electron.db.createNote).mockResolvedValue(mockNote);

      const result = await client.createNote(input);

      expect(window.electron.db.createNote).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockNote);
    });

    it('should handle note creation with title', async () => {
      const input = { title: 'My Note', content: 'Content here' };
      const noteWithTitle = { ...mockNote, title: 'My Note' };
      vi.mocked(window.electron.db.createNote).mockResolvedValue(noteWithTitle);

      const result = await client.createNote(input);

      expect(result.title).toBe('My Note');
      expect(window.electron.db.createNote).toHaveBeenCalledWith(input);
    });
  });

  describe('getNoteById', () => {
    it('should call window.electron.db.getNoteById with correct id', async () => {
      vi.mocked(window.electron.db.getNoteById).mockResolvedValue(mockNote);

      const result = await client.getNoteById(1);

      expect(window.electron.db.getNoteById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNote);
    });

    it('should return null when note not found', async () => {
      vi.mocked(window.electron.db.getNoteById).mockResolvedValue(null);

      const result = await client.getNoteById(999);

      expect(result).toBeNull();
      expect(window.electron.db.getNoteById).toHaveBeenCalledWith(999);
    });
  });

  describe('getAllNotes', () => {
    it('should call window.electron.db.getAllNotes', async () => {
      const notes = [mockNote, { ...mockNote, id: 2 }];
      vi.mocked(window.electron.db.getAllNotes).mockResolvedValue(notes);

      const result = await client.getAllNotes();

      expect(window.electron.db.getAllNotes).toHaveBeenCalled();
      expect(result).toEqual(notes);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no notes exist', async () => {
      vi.mocked(window.electron.db.getAllNotes).mockResolvedValue([]);

      const result = await client.getAllNotes();

      expect(result).toEqual([]);
    });
  });

  describe('updateNote', () => {
    it('should call window.electron.db.updateNote with correct parameters', async () => {
      const input = { content: 'Updated content' };
      const updatedNote = { ...mockNote, content: 'Updated content' };
      vi.mocked(window.electron.db.updateNote).mockResolvedValue(updatedNote);

      const result = await client.updateNote(1, input);

      expect(window.electron.db.updateNote).toHaveBeenCalledWith(1, input);
      expect(result).toEqual(updatedNote);
    });

    it('should handle updating title and content', async () => {
      const input = { title: 'New Title', content: 'New Content' };
      const updatedNote = { ...mockNote, title: 'New Title', content: 'New Content' };
      vi.mocked(window.electron.db.updateNote).mockResolvedValue(updatedNote);

      const result = await client.updateNote(1, input);

      expect(result?.title).toBe('New Title');
      expect(result?.content).toBe('New Content');
    });

    it('should return null when note not found', async () => {
      vi.mocked(window.electron.db.updateNote).mockResolvedValue(null);

      const result = await client.updateNote(999, { content: 'test' });

      expect(result).toBeNull();
    });
  });

  describe('deleteNote', () => {
    it('should call window.electron.db.deleteNote with correct id', async () => {
      vi.mocked(window.electron.db.deleteNote).mockResolvedValue(true);

      const result = await client.deleteNote(1);

      expect(window.electron.db.deleteNote).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should return false when note not found', async () => {
      vi.mocked(window.electron.db.deleteNote).mockResolvedValue(false);

      const result = await client.deleteNote(999);

      expect(result).toBe(false);
    });
  });

  describe('searchNotes', () => {
    it('should call window.electron.db.searchNotes with query', async () => {
      const searchResults = [mockNote];
      vi.mocked(window.electron.db.searchNotes).mockResolvedValue(searchResults);

      const result = await client.searchNotes('test');

      expect(window.electron.db.searchNotes).toHaveBeenCalledWith('test');
      expect(result).toEqual(searchResults);
    });

    it('should return empty array when no results found', async () => {
      vi.mocked(window.electron.db.searchNotes).mockResolvedValue([]);

      const result = await client.searchNotes('nonexistent');

      expect(result).toEqual([]);
    });

    it('should handle special characters in search query', async () => {
      vi.mocked(window.electron.db.searchNotes).mockResolvedValue([]);

      await client.searchNotes('test%query_with*special');

      expect(window.electron.db.searchNotes).toHaveBeenCalledWith('test%query_with*special');
    });
  });
});
