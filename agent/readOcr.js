const fs = require('fs')

module.exports = (text) => {
  const data = JSON.parse(fs.readFileSync('/tmp/ocr.json', 'utf8'))
  let active = []
  for (const symbol of data) {
    active.push(new Matcher(text))
    active = active.filter((x) => x.accepts(symbol))
  }
  active = active.filter((x) => x.completed)
  active.sort((a, b) => {
    if (a.mistakes < b.mistakes) return -1
    if (a.mistakes > b.mistakes) return 1
    if (a.size > b.size) return -1
    if (a.size < b.size) return 1
    return 0
  })
  return active[0]
}

class Matcher {
  constructor(text) {
    this.text = text.toLowerCase().replace(/\s/g, '')
    this.i = 0
    this.mistakes = 0
    this.read = ''
    this.lastWordId = undefined
    this.lastLineId = undefined
    this.completed = false
    this.size = 0
    this._x = 0
    this._y = 0
  }
  get x() {
    return Math.round(this._x)
  }
  get y() {
    return Math.round(this._y)
  }
  accepts([lineId, wordId, x1, y1, x2, y2, ch]) {
    if (this.completed) {
      return true
    }
    const correct = this.text[this.i] === ch.toLowerCase()
    if (this.lastWordId && this.lastWordId !== wordId) {
      this.read += ' '
    }
    if (this.lastLineId && this.lastLineId !== lineId) {
      return false
    }
    this.lastWordId = wordId
    this.lastLineId = lineId
    this.read += ch
    this.size += (y2 - y1) * (x2 - x1)
    this._x *= this.i
    this._y *= this.i
    this.i++
    this._x += (x1 + x2) / 2
    this._y += (y1 + y2) / 2
    this._x /= this.i
    this._y /= this.i
    if (!correct) {
      this.mistakes++
    }
    if (this.mistakes > 3) {
      return false
    }
    if (this.i >= this.text.length) {
      this.completed = true
    }
    return true
  }
}

if (require.main === module) {
  console.log(module.exports(process.argv[2]))
}
