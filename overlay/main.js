const { screen, app, BrowserWindow } = require('electron')
const io = require('socket.io-client')

const socket = io('http://desktop:2138')
let cwin

app.whenReady().then(async () => {
  await new Promise((r) => setTimeout(r, 300))
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    x: 0,
    y: 0,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    focusable: false,
    fullscreen: true,
  })
  cwin = win
  win.setIgnoreMouseEvents(true)
  win.loadURL('file://' + __dirname + '/overlay.html')

  async function dispatch(event) {
    try {
      await win.webContents.executeJavaScript(
        `dispatch(${JSON.stringify(event)})`
      )
    } catch (error) {
      console.error(error)
    }
  }

  socket.on('event', (event) => {
    if (!event.mouse) {
      console.log(event)
    }
    dispatch(event)
  })

  process.stdin.on('data', (b) => {
    if (b.toString().includes('\n')) {
      dispatch({ reload: 1 })
    }
  })
})
