const { screen, app, BrowserWindow } = require('electron')
const express = require('express')
const expressApp = express()
const acquireLock = require('throat')(1)
let cwin

expressApp.use(express.json())

expressApp.post('/rpc', async (req, res, next) => {
  const id = require.resolve('./rpcHandler')
  delete require.cache[id]
  const rpcHandler = require(id)
  try {
    const result = await acquireLock(() =>
      rpcHandler.handle(req.body, {
        sendToRenderer: (event) => {
          cwin.webContents.executeJavaScript(
            `writeMessage(${JSON.stringify(event)})`
          )
        },
      })
    )
    res.json(result)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

expressApp.listen(2138, () => {
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
