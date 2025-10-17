const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script - Exposes safe IPC methods to the renderer process
 * This acts as a bridge between the main process and the renderer
 *
 * Security: Only expose specific methods, never expose the entire ipcRenderer
 */

// Define the API that will be exposed to the renderer
interface ElectronAPI {
  // App info
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;

  // File system operations (to be implemented)
  // readFile: (path: string) => Promise<string>;
  // writeFile: (path: string, content: string) => Promise<void>;
  // deleteFile: (path: string) => Promise<void>;

  // Database operations (to be implemented)
  // db: {
  //   query: (sql: string, params?: any[]) => Promise<any>;
  //   execute: (sql: string, params?: any[]) => Promise<void>;
  // };
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // App info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),

  // Add more methods as needed during development
} as ElectronAPI);
