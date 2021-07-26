const { screen, app, BrowserWindow } = require('electron')
const express = require('express')
const expressApp = express()
const httpServer = require('http').createServer(expressApp)
const acquireLock = require('throat')(1)
const io = require('socket.io')(httpServer)

expressApp.use(express.json())

expressApp.post('/rpc', async (req, res, next) => {
  const id = require.resolve('./rpcHandler')
  delete require.cache[id]
  const rpcHandler = require(id)
  try {
    const result = await acquireLock(() =>
      rpcHandler.handle(req.body, {
        sendToRenderer: (event) => {
          io.emit('event', event)
        },
      })
    )
    res.json(result)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

httpServer.listen(2138, () => {
  console.log('ok')
})

app.whenReady().then(async () => {
  setInterval(async () => {
    try {
      const p = screen.getCursorScreenPoint()
      io.emit('event', { mouse: { x: p.x, y: p.y } })
    } catch (error) {
      console.error(error)
    }
  }, 100)
})
