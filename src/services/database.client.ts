/**
 * Database Client Service
 *
 * Renderer-side wrapper for Electron database operations.
 * Provides type-safe API for React components to interact with SQLite database.
 */

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CreateNoteInput {
  title?: string;
  content: string;
}

interface UpdateNoteInput {
  title?: string;
  content?: string;
}

export class DatabaseClient {
  private static instance: DatabaseClient;

  private constructor() {
    // Private constructor for singleton pattern
    this.checkElectronAPI();
  }

  /**
   * Check if Electron API is available
   */
  private checkElectronAPI(): void {
    if (typeof window === 'undefined' || !window.electron || !window.electron.db) {
      console.warn('Electron API not available. Database operations will fail.');
      console.warn('Make sure you are running the app in Electron, not just in a web browser.');
    }
  }

  /**
   * Verify Electron API is available before making calls
   */
  private ensureElectronAPI(): void {
    if (typeof window === 'undefined' || !window.electron || !window.electron.db) {
      throw new Error(
        'Database is only available in Electron. ' +
          'Please run the app using "pnpm electron:dev" or "pnpm build" instead of "pnpm dev".'
      );
    }
  }

  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  /**
   * Create a new note
   */
  async createNote(input: CreateNoteInput): Promise<Note> {
    this.ensureElectronAPI();
    return window.electron.db.createNote(input);
  }

  /**
   * Get a note by ID
   */
  async getNoteById(id: number): Promise<Note | null> {
    this.ensureElectronAPI();
    return window.electron.db.getNoteById(id);
  }

  /**
   * Get all notes
   */
  async getAllNotes(): Promise<Note[]> {
    this.ensureElectronAPI();
    return window.electron.db.getAllNotes();
  }

  /**
   * Update a note
   */
  async updateNote(id: number, input: UpdateNoteInput): Promise<Note | null> {
    this.ensureElectronAPI();
    return window.electron.db.updateNote(id, input);
  }

  /**
   * Delete a note
   */
  async deleteNote(id: number): Promise<boolean> {
    this.ensureElectronAPI();
    return window.electron.db.deleteNote(id);
  }

  /**
   * Search notes by query
   */
  async searchNotes(query: string): Promise<Note[]> {
    this.ensureElectronAPI();
    return window.electron.db.searchNotes(query);
  }
}

// Export singleton instance
export const databaseClient = DatabaseClient.getInstance();

// Export types
export type { Note, CreateNoteInput, UpdateNoteInput };
