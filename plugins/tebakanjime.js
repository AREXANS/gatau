let fetch = require('node-fetch')

let timeout = 120000
let poin = 500
let handler = async (m, { conn, usedPrefix, command }) => {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
    let id = m.chat
    if (id in conn.tebakanime) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0])
        throw false
    }
    let res = await (await fetch('https://raw.githubusercontent.com/Luigmntng/RESTAPI/master/data/tebakchara.json)).json()
    let json = res[Math.floor(Math.random() * res.length)]
    let caption = `
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}wa untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebakanime[id] = [
        await conn.sendButtonImg(m.chat, json.image, caption, 'By Lui', 'Bantuan', '.wa', m, false),
        json, poin,
        setTimeout(async () => {
            if (conn.tebakanime[id]) await conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}\nDesk : ${json.desc}*`, conn.tebakanime[id][0])
            delete conn.tebakanime[id]
        }, timeout)
    ]
}
handler.help = ['tebakanime']
handler.tags = ['game']
handler.command = /^tebakanime$/i

module.exports = handler
