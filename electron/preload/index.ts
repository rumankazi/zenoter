const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script - Exposes safe IPC methods to the renderer process
 * This acts as a bridge between the main process and the renderer
 *
 * Security: Only expose specific methods, never expose the entire ipcRenderer
 */

// Database types
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

// Define the API that will be exposed to the renderer
interface ElectronAPI {
  // App info
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;

  // Database operations
  db: {
    createNote: (input: CreateNoteInput) => Promise<Note>;
    getNoteById: (id: number) => Promise<Note | null>;
    getAllNotes: () => Promise<Note[]>;
    updateNote: (id: number, input: UpdateNoteInput) => Promise<Note | null>;
    deleteNote: (id: number) => Promise<boolean>;
    searchNotes: (query: string) => Promise<Note[]>;
  };
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // App info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),

  // Database operations
  db: {
    createNote: (input: CreateNoteInput) => ipcRenderer.invoke('db:createNote', input),
    getNoteById: (id: number) => ipcRenderer.invoke('db:getNoteById', id),
    getAllNotes: () => ipcRenderer.invoke('db:getAllNotes'),
    updateNote: (id: number, input: UpdateNoteInput) =>
      ipcRenderer.invoke('db:updateNote', id, input),
    deleteNote: (id: number) => ipcRenderer.invoke('db:deleteNote', id),
    searchNotes: (query: string) => ipcRenderer.invoke('db:searchNotes', query),
  },
} as ElectronAPI);
