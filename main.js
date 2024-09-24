const { app, BrowserWindow, ipcMain, dialog } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: __dirname + '/preload.js' // 使用 preload 脚本
    }
  });

  win.loadURL('http://fish.wawacall.com');

  // 拦截弹窗请求
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault(); // 阻止默认行为
    // 使用自定义对话框替代弹窗
    win.webContents.send('show-dialog', {
      message: 'This is a custom dialog!',
    });
  });

  // 监听页面加载完成
  win.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
  });

  // 打开开发者工具
  // win.webContents.openDevTools();
}

// 应用启动时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 退出应用
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 处理打印请求
ipcMain.on('print-request', async (event) => {
  win.webContents.print({}, (success, failureReason) => {
    if (!success) {
      console.log(failureReason);
    } else {
      console.log('打印任务完成');
    }
  });

  await dialog.showMessageBox(win, {
    type: 'info',
    buttons: ['OK'],
    title: 'Alert',
    message: 'Print request received!',
  });
});
