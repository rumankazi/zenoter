/// <reference types="vite/client" />

/**
 * Electron API type declarations for the renderer process
 * This ensures TypeScript knows about the APIs exposed by the preload script
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

interface ElectronAPI {
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;

  db: {
    createNote: (input: CreateNoteInput) => Promise<Note>;
    getNoteById: (id: number) => Promise<Note | null>;
    getAllNotes: () => Promise<Note[]>;
    updateNote: (id: number, input: UpdateNoteInput) => Promise<Note | null>;
    deleteNote: (id: number) => Promise<boolean>;
    searchNotes: (query: string) => Promise<Note[]>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
