'use strict';
const { contextBridge, ipcRenderer } = require('electron');
// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // App info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  // Add more methods as needed during development
});
//# sourceMappingURL=index.js.map
