/// <reference types="vite/client" />

/**
 * Type definitions for Electron API exposed via preload script
 */

export interface ElectronAPI {
  // App info
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
