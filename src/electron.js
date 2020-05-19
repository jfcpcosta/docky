const {app, BrowserWindow} = require('electron');
const {join} = require('path');
const isDev = require('electron-is-dev');
const DockyTrayMenu = require('./tray');

let mainWindow;

function start() {
    DockyTrayMenu.init();
    createWindow();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, 
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${join(__dirname, '../build/index.html')}`);

  if (isDev) {
    //BrowserWindow.addDevToolsExtension('react-dev-tools');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);
}

app.whenReady().then(start);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});