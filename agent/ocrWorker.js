const { createWorker } = require('tesseract.js')
const path = require('path')

let promise

const worker = createWorker({
  langPath: path.join(__dirname, 'tessdata'),
  gzip: false,
  // Required on read-only file system
  cacheMethod: 'readOnly',
})

function getWorker() {
  if (!promise) {
    promise = initializeWorker()
  }
  return promise
}

async function initializeWorker() {
  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  return worker
}

exports.getWorker = getWorker
