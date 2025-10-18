/**
 * Database Service
 * SQLite database management for notes
 * Runs in Electron main process
 */

import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

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
 * Database service for managing notes
 * Singleton pattern to ensure one database connection
 */
export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private db: Database.Database | null = null;
  private readonly dbPath: string;

  private constructor() {
    // Store database in user data directory
    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'data');

    // Ensure data directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'zenoter.db');
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize database connection and run migrations
   */
  public async initialize(): Promise<void> {
    if (this.db) {
      return; // Already initialized
    }

    try {
      this.db = new Database(this.dbPath);

      // Enable WAL mode for better concurrency
      this.db.pragma('journal_mode = WAL');

      // Run migrations
      await this.runMigrations();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Run database migrations
   */
  private async runMigrations(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Check if migrations table exists
    const tableExists = this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'")
      .get();

    if (!tableExists) {
      // Create migrations table
      this.db.exec(`
        CREATE TABLE migrations (
          version INTEGER PRIMARY KEY,
          applied_at TEXT NOT NULL
        )
      `);
    }

    // Get current version
    const currentVersion = this.getCurrentVersion();

    // Run pending migrations
    if (currentVersion < 1) {
      this.runMigrationV1();
    }

    // Add more migrations as needed
  }

  /**
   * Get current database version
   */
  private getCurrentVersion(): number {
    if (!this.db) {
      return 0;
    }

    const result = this.db.prepare('SELECT MAX(version) as version FROM migrations').get() as {
      version: number | null;
    };

    return result.version ?? 0;
  }

  /**
   * Migration V1: Create notes table
   */
  private runMigrationV1(): void {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    console.log('Running migration V1: Create notes table');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
    `);

    // Record migration
    this.db
      .prepare('INSERT INTO migrations (version, applied_at) VALUES (?, CURRENT_TIMESTAMP)')
      .run(1);

    console.log('Migration V1 completed successfully');
  }

  /**
   * Create a new note
   */
  public createNote(input: CreateNoteInput): Note {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stmt = this.db.prepare(`
      INSERT INTO notes (title, content)
      VALUES (?, ?)
    `);

    const info = stmt.run(input.title ?? '', input.content);

    return this.getNoteById(info.lastInsertRowid as number)!;
  }

  /**
   * Get note by ID
   */
  public getNoteById(id: number): Note | null {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stmt = this.db.prepare('SELECT * FROM notes WHERE id = ?');
    return stmt.get(id) as Note | null;
  }

  /**
   * Get all notes ordered by updated_at (newest first)
   */
  public getAllNotes(): Note[] {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stmt = this.db.prepare('SELECT * FROM notes ORDER BY updated_at DESC');
    return stmt.all() as Note[];
  }

  /**
   * Update an existing note
   */
  public updateNote(id: number, input: UpdateNoteInput): Note | null {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Whitelist of allowed field names to prevent SQL injection
    const allowedFields = ['title', 'content'] as const;
    type AllowedField = (typeof allowedFields)[number];

    const updates: string[] = [];
    const params: (string | number)[] = [];

    // Validate and build SET clause with whitelisted fields
    Object.keys(input).forEach((key) => {
      if (allowedFields.includes(key as AllowedField)) {
        const value = input[key as keyof UpdateNoteInput];
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value);
        }
      }
    });

    if (updates.length === 0) {
      return this.getNoteById(id);
    }

    // Always update the updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const stmt = this.db.prepare(`
      UPDATE notes
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...params);

    return this.getNoteById(id);
  }

  /**
   * Delete a note
   */
  public deleteNote(id: number): boolean {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stmt = this.db.prepare('DELETE FROM notes WHERE id = ?');
    const info = stmt.run(id);

    return info.changes > 0;
  }

  /**
   * Search notes by content or title
   */
  public searchNotes(query: string): Note[] {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stmt = this.db.prepare(`
      SELECT * FROM notes
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY updated_at DESC
    `);

    const searchPattern = `%${query}%`;
    return stmt.all(searchPattern, searchPattern) as Note[];
  }

  /**
   * Close database connection
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      DatabaseService.instance = null;
      console.log('Database connection closed');
    }
  }

  /**
   * Get database path (for testing/debugging)
   */
  public getDbPath(): string {
    return this.dbPath;
  }
}
