const { screen, app, BrowserWindow } = require('electron')

let cwin
const server = require('http').createServer((req, res) => {
  ;(async () => {
    try {
      await cwin.webContents.executeJavaScript(
        `writeMessage(${JSON.stringify(
          Buffer.from(req.headers['x-message'], 'base64').toString('utf8')
        )})`
      )
    } catch (error) {
      console.error(error)
    }
  })()
  res.end()
})
server.listen(2138, () => {
  console.log('ok')
})

app.whenReady().then(async () => {
  await new Promise((r) => setTimeout(r, 300))
  const b = screen.getAllDisplays()[0].bounds
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
  setInterval(async () => {
    try {
      const p = screen.getCursorScreenPoint()
      await win.webContents.executeJavaScript(`setPosition(${p.x}, ${p.y})`)
    } catch (error) {
      console.error(error)
    }
  }, 100)
})
