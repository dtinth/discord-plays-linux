const { createWorker } = require('tesseract.js')
const path = require('path')
const screenshot = require('screenshot-desktop')

const worker = createWorker({
  langPath: path.join(__dirname, 'tessdata'),
  gzip: false,
  // Required on read-only file system
  cacheMethod: 'readOnly',
})

function log(text) {
  console.log(`[${new Date().toJSON()}] ${text}`)
}

;(async () => {
  log('Loading')
  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  const check = async () => {
    log('Screenshot')
    const img = await screenshot({ format: 'png' })
    log('Recognize')
    const output = []
    const {
      data: { lines },
    } = await worker.recognize(img)
    let lineId = 0
    let wordId = 0
    for (const line of lines) {
      lineId++
      for (const word of line.words) {
        wordId++
        for (const symbol of word.symbols) {
          output.push([
            lineId,
            wordId,
            symbol.bbox.x0,
            symbol.bbox.y0,
            symbol.bbox.x1,
            symbol.bbox.y1,
            symbol.text,
          ])
        }
      }
    }
    log('Finish. Word count: ' + wordId)
    return output
  }
  for (;;) {
    const output = await check()
    require('fs').writeFileSync(
      '/tmp/ocr.json',
      '[' + output.map((x) => JSON.stringify(x)).join('\n,') + ']'
    )
    await new Promise((r) => setTimeout(r, 1000))
  }
  await worker.terminate()
})()
