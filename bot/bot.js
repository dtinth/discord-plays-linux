const Discord = require('discord.js')
const client = new Discord.Client()
const axios = require('axios')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// const runCmd = throat(1, async (c, msg) => {
//   const member = msg.member
//   if (!member) return
//   const name = member.nickname
//     ? `${member.nickname} (${member.user.tag})`
//     : member.user.tag
//   const event = { message: `${name}: ${c.join(' ')}` }
//   const xMessage = Buffer.from(JSON.stringify(event)).toString('base64')
//   execa(
//     `docker exec virta curl http://localhost:2138 -H "x-message: ${xMessage}"`,
//     { shell: true }
//   ).catch((e) => {
//     console.error(e)
//   })
//   const x =
//     c[0] === 'copy'
//       ? await execa(
//           'docker',
//           [
//             'exec',
//             '-i',
//             '-e',
//             'DISPLAY=:10.0',
//             '-e',
//             'LC_ALL=en_US.utf8',
//             'virta',
//             'sudo',
//             '-Hu',
//             'guest',
//             'xsel',
//             '-i',
//             '-b',
//           ],
//           { all: true, reject: false, input: c[1] }
//         )
//       : await execa(
//           'docker',
//           [
//             'exec',
//             '-e',
//             'DISPLAY=:10.0',
//             '-e',
//             'LC_ALL=en_US.utf8',
//             'virta',
//             'sudo',
//             '-Hu',
//             'guest',
//             'xdotool',
//             ...c,
//           ],
//           { all: true, reject: false }
//         )
//   const out = x.all.trim()
//   if (out) msg.reply(out)
//   await new Promise((r) => setTimeout(r, 250))
//   return x.exitCode === 0
// })

const enabledChannels = new Set(process.env.DISCORD_CHANNELS.split(','))

client.on('message', async (msg) => {
  if (enabledChannels.has(msg.channel.id) && msg.author && !msg.author.bot) {
    const member = msg.member
    if (!member) return
    const name = member.nickname
      ? `${member.nickname} (${member.user.tag})`
      : member.user.tag
    const content = msg.content
    console.log({ name, content })
    axios
      .post('http://desktop:2138/rpc', { message: { name, content } })
      .catch((error) => {
        console.log(error)
      })
  }
})

client.login(process.env.DISCORD_TOKEN)
