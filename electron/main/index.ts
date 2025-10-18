import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseService } from './database.service.js';

// Handle ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let dbService: DatabaseService | null = null;

// Check if running in development mode
const isDev = !app.isPackaged || process.env.NODE_ENV === 'development';

/**
 * Create the main application window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false, // Security: disable node integration
      contextIsolation: true, // Security: enable context isolation
      sandbox: true, // Security: enable sandbox
      preload: path.join(__dirname, '../preload/index.js'),
    },
    backgroundColor: '#ffffff', // Match web version background
    show: false, // Don't show until ready
    titleBarStyle: 'default',
    frame: true,
    icon: path.join(__dirname, '../../build/icon.png'),
  }); // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  // Show window when ready to prevent flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * App lifecycle: Ready
 */
app.whenReady().then(async () => {
  // Initialize database
  dbService = DatabaseService.getInstance();
  await dbService.initialize();

  // Configure Content Security Policy (CSP) for both dev and production
  // Following Electron Security Guide: https://electronjs.org/docs/tutorial/security
  // Reference: VS Code implementation in src/vs/code/electron-main/app.ts
  //
  // Development: Allow Vite dev server with unsafe-inline/unsafe-eval for HMR
  // Production: Strict CSP with NO unsafe-inline/unsafe-eval (all styles in CSS Modules)

  session.defaultSession.webRequest.onHeadersReceived(
    (
      details: Electron.OnHeadersReceivedListenerDetails,
      callback: (response: Electron.HeadersReceivedResponse) => void
    ) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            isDev
              ? // Development mode
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173; " +
                "style-src 'self' 'unsafe-inline' http://localhost:5173; " +
                "img-src 'self' data: http://localhost:5173; " +
                "font-src 'self' data:; " +
                "connect-src 'self' ws://localhost:5173 http://localhost:5173; " +
                "worker-src 'self' blob:;"
              : // Production: STRICT CSP - NO unsafe-inline, NO unsafe-eval
                // All styles in CSS Modules, all scripts bundled
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self'; " +
                "img-src 'self' data:; " +
                "font-src 'self' data:; " +
                "connect-src 'self'; " +
                "worker-src 'self' blob:;",
          ],
        },
      });
    }
  );

  createWindow();

  // macOS: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * App lifecycle: All windows closed
 */
app.on('window-all-closed', () => {
  // On macOS, apps stay active until explicitly quit
  if (process.platform !== 'darwin') {
    // Close database connection
    if (dbService) {
      dbService.close();
    }
    app.quit();
  }
});

/**
 * App lifecycle: Before quit
 */
app.on('before-quit', () => {
  // Ensure database is closed
  if (dbService) {
    dbService.close();
  }
});

/**
 * Security: Prevent navigation to external URLs
 */
app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // Allow navigation only within the app
    if (isDev) {
      // In dev: allow localhost:5173 only
      if (parsedUrl.origin !== 'http://localhost:5173') {
        event.preventDefault();
      }
    } else {
      // In prod: allow file: protocol only
      if (parsedUrl.protocol !== 'file:') {
        event.preventDefault();
      }
    }
  });
});

/**
 * IPC Handlers - Add your IPC communication here
 */

// Example: Get app version
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

// Example: Get platform
ipcMain.handle('app:getPlatform', () => {
  return process.platform;
});

// Database IPC Handlers
ipcMain.handle('db:createNote', async (_event, input) => {
  if (!dbService) {
    throw new Error('Database not initialized');
  }
  return dbService.createNote(input);
});

ipcMain.handle('db:getNoteById', async (_event, id: number) => {
  if (!dbService) {
    throw new Error('Database not initialized');
  }
  return dbService.getNoteById(id);
});

ipcMain.handle('db:getAllNotes', async () => {
  if (!dbService) {
    throw new Error('Database not initialized');
  }
  return dbService.getAllNotes();
});

ipcMain.handle('db:updateNote', async (_event, id: number, input) => {
  if (!dbService) {
    throw new Error('Database not initialized');
  }
  return dbService.updateNote(id, input);
});

ipcMain.handle('db:deleteNote', async (_event, id: number) => {
  if (!dbService) {
    throw new Error('Database not initialized');
  }
  return dbService.deleteNote(id);
});

ipcMain.handle('db:searchNotes', async (_event, query: string) => {
  if (!dbService) {
    throw new Error('Database not initialized');
  }
  return dbService.searchNotes(query);
});
