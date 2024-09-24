const { contextBridge, ipcRenderer } = require('electron');

// 暴露一个安全的API，允许网站发送打印请求
contextBridge.exposeInMainWorld('electronAPI', {
  sendPrintRequest: () => ipcRenderer.send('print-request')
});

ipcRenderer.on('show-dialog', (event, { message }) => {
  // 显示自定义对话框
  const userResponse = confirm(message);
  // 处理用户响应（如果需要）
  if (userResponse) {
    console.log('User clicked OK');
  } else {
    console.log('User clicked Cancel');
  }
});