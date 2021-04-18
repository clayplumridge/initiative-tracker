import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";

const createWindow = () => {
    let win = new BrowserWindow({
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        width: 800
    });

    console.log(`Electron is-dev: ${isDev}`);
    win.loadURL(
        isDev
            ? "http://localhost:9000"
            : `file://${app.getAppPath()}/index.html`
    );
};

app.on("ready", createWindow);
