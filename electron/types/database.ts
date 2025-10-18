/**
 * Shared Database Types
 * Type definitions for the SQLite database schema
 * Shared between main and renderer processes
 */

/**
 * Note entity from the database
 */
export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new note
 */
export interface CreateNoteInput {
  title?: string;
  content: string;
}

/**
 * Input type for updating an existing note
 */
export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

/**
 * Database schema version for migrations
 */
export const DB_VERSION = 1;
