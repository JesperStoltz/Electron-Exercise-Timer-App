const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

//process.env.NODE_ENV = "production";
process.env.NODE_ENV = "development";

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on("ready", function () {
    // Create new window
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load the html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: "file:",
        slashes: true
    }));
    //Quit app when closed
    mainWindow.on("closed", function(){
        app.quit();
    })

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert the menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow() {
    // Create new window
    addWindow = new BrowserWindow({
        width: 600,
        height: 800,
        title: "Add Exercises",
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load the html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: "file:",
        slashes: true
    }));
    //Garbage collection handle
    addWindow.on("close", function(){
        addWindow = null;
    })
}

//Catch item:add
ipcMain.on("exercise:add", function(e, exercise){
    mainWindow.webContents.send("exercise:add", exercise);
    addWindow.close();
});

//Create menu template
const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Add Item",
                click() {
                    createAddWindow();
                }
            },
            {
                label: "Clear items",
                click(){
                    mainWindow.webContents.send("item:clear")
                }
            },
            {
                label: "Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q", //darwin === mac-dator
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == "darwin") {
    mainMenuTemplate.unshift({});
    //För att menyn ska se ut som den ska på en mac
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push({
        label: "Developer Tools",
        submenu: [
            {
                label: "Toggle DevTools",
                accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I", //darwin === mac-dator
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: "reload"
            }
        ]
    })
}