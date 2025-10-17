import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

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
app.whenReady().then(() => {
  // Configure Content Security Policy for both dev and production
  // Following Electron Security Guide: https://electronjs.org/docs/tutorial/security
  // Reference: VS Code implementation in src/vs/code/electron-main/app.ts

  session.defaultSession.webRequest.onHeadersReceived(
    (details: any, callback: (response: any) => void) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            isDev
              ? // Development: Allow Vite HMR (no 'unsafe-inline' needed!)
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self'; " + // Vite loads CSS via <link> tags
                "img-src 'self' data: https:; " +
                "connect-src 'self' ws://localhost:5173 wss://localhost:5173; " + // WebSocket for HMR
                "font-src 'self';"
              : // Production: Strict CSP
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self' data:; " +
                "connect-src 'self'; " +
                "frame-src 'none'; " +
                "object-src 'none'; " +
                "base-uri 'self';",
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
    app.quit();
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
