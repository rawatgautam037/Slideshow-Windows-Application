'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;

var os = require('os');
var {dialog} = require('electron');

var mainWindow = null;
var ipc = require('electron').ipcMain;

ipc.on('close-main-window', function() {
    app.quit();
});

app.on('ready', ()=> {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            images: true,
        },
        resizable: true,
        height: 600,
        width: 800,
    });

mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    ipc.on('open-file-dialog-for-file', function (event) {
    //     if(os.platform() === 'linux' || os.platform() === 'win32'){
    //        dialog.showOpenDialog({
    //            properties: ['openFile']
    //        }, function (files) {
    //           if (files) event.sender.send('selected-file', files[0]);
    //        });
    //    } else {
    //        dialog.showOpenDialog({
    //            properties: ['openFile', 'openDirectory']
    //        }, function (files) {
    //            if (files) event.sender.send('selected-file', files[0]);
    //        });
    //    }

    if(os.platform() === 'linux' || os.platform() === 'win32'){
        dialog.showOpenDialog({
            properties: ['openDirectory'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'gif']}
            ]
        }).then((data) => {
             event.sender.send('selected-folder', data.filePaths[0]);
        })
    }
    });
});
 