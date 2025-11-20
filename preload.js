// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('openFileDialog'),

  readDir: (dirPath) => {
    return function() {  // ← 這裡加一層 function
      const names = fs.readdirSync(dirPath);
      return names.map(name => {
        const full = path.join(dirPath, name);
        return {
          name,
          isDir: fs.statSync(full).isDirectory()
        };
      });
    };
  }
});
