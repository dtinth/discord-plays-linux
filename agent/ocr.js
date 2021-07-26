const { getWorker } = require('./ocrWorker')
const screenshot = require('screenshot-desktop')

function log(text) {
  console.log(`[${new Date().toJSON()}] ${text}`)
}

const readScreen = async () => {
  const worker = await getWorker()
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

exports.readScreen = readScreen

if (require.main === module) {
  ;(async () => {
    log('Loading')
    for (;;) {
      const output = await readScreen()
      require('fs').writeFileSync(
        '/tmp/ocr.json',
        '[' + output.map((x) => JSON.stringify(x)).join('\n,') + ']'
      )
      await new Promise((r) => setTimeout(r, 1000))
    }
  })()
}
