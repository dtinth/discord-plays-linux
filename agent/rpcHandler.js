const execa = require('execa')

exports.handle = async (body, { sendToRenderer }) => {
  if (body.message) {
    const { message } = body
    const actions = parseCommand(message.content)
    if (actions.length) {
      console.log(message)
      for (const action of actions) {
        console.log(' =>', action.name)
        await action.execute().catch((error) => {
          console.error(error)
        })
        await new Promise((r) => setTimeout(r, 100))
      }
    }
  } else {
    sendToRenderer(body)
  }
}

function xdotool(...args) {
  return {
    name: args.join(' '),
    execute: async () => execa('xdotool', args, { reject: false }),
  }
}

function copy(text) {
  return {
    name: 'copy ' + text,
    execute: async () => require('electron').clipboard.writeText(text),
  }
}

function parseCommand(content) {
  const cmds = String(content)
    .trim()
    .split('\n')
    .map((r) => r.trim())
    .filter((x) => x)
  const actions = []
  for (const text of cmds) {
    let m
    if ((m = text.match(/^m\s*(-?\d+)\s*,?\s*(-?\d+)$/))) {
      actions.push(xdotool('mousemove_relative', '--', m[1], m[2]))
    } else if ((m = text.match(/^M\s*(\d+)\s*,?\s*(\d+)$/))) {
      actions.push(xdotool('mousemove', m[1], m[2]))
    } else if ((m = text.match(/^l\s*(-?\d+)\s*,?\s*(-?\d+)$/))) {
      actions.push(
        xdotool('mousedown', '1'),
        xdotool('mousemove_relative', '--', m[1], m[2]),
        xdotool('mouseup', '1')
      )
    } else if ((m = text.match(/^L\s*(\d+)\s*,?\s*(\d+)$/))) {
      actions.push(
        xdotool('mousedown', '1'),
        xdotool('mousemove', m[1], m[2]),
        xdotool('mouseup', '1')
      )
    } else if ((m = text.match(/^c$/))) {
      actions.push(xdotool('click', '1'))
    } else if ((m = text.match(/^e$/))) {
      actions.push(xdotool('key', 'Return'))
    } else if ((m = text.match(/^mc$/))) {
      actions.push(xdotool('click', '2'))
    } else if ((m = text.match(/^rc$/))) {
      actions.push(xdotool('click', '3'))
    } else if ((m = text.match(/^u+$/))) {
      actions.push(xdotool('click', '--repeat', m[0].length, '4'))
    } else if ((m = text.match(/^d+$/))) {
      actions.push(xdotool('click', '--repeat', m[0].length, '5'))
    } else if ((m = text.match(/^t\s+([^]+)$/))) {
      actions.push(xdotool('type', m[1]))
    } else if ((m = text.match(/^y\s+([^]+)$/))) {
      actions.push(copy(m[1]))
    } else if ((m = text.match(/^k\s+([^]+)$/))) {
      m[1].split(/\s+/).forEach((k) => actions.push(xdotool('key', k)))
    }
  }
  return actions
}
