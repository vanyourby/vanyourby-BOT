require('dotenv').config()
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const { downloader, cekResi, removebg, urlShortener, meme, translate, getLocationData, fetish, lewd, waifu, wallpaper } = require('../../lib')
const { msgFilter, color, processTime, isUrl } = require('../../utils')
const axios = require('axios')
const os = require('os')
const fs = require('fs-extra')
const get = require('got')
const { liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv } = require('../../lib/functions')
const quotedd = require('../../lib/quote')
const mentionList = require('../../utils/mention')
const { uploadImages } = require('../../utils/fetcher')

const responses = [
    'Adalah yoi',
    'True min',
    'Lah anda siapa?',
    'Se7',
    'Jangan tanya gw lah',
    'Gak',
    'Ya',
    'Adalah false',
    'Adalah true',
    'Puguh',
    'Ga jelas lu asu',
    'Dih ga jelas',
    'maaf aku ga ngerti kak',
    'anak ini ga jelas juga',
    'Sok asik lu huuu',
    'Mungkin..',
    'nyanyiin dulu baru aku kasih tau',
    'ga mau ah,aku lagi ngambek',
    'ga jelas lu huuu',
    'iyah sakit ah ikeh',
    'anjay',
    'ga ah lu ga jelas',
    'kinthil bapak kao pecah njing',
    'Yang namanya adit jelek',
    'udah pernah keluar paku dari puser blum?',
    'Sugan mabar yekan?',
    'G u bau',
    'Cari tau sendiri',
    'Keknya sih iya',
    'Keknya sih nggak',
    'Lah serius?',
    'Anjir',
    'Gak tau',
    'Pukimak',
    'Meureun, gw juga gak tau sih',
    'Kagak',
    'Setelah gw pikir sih gak mungkin',
    'Setelah gw pikir sih mungkin aja',
    'Y',
    'G',
    'Terserah',
    'Terserah lu',
    'ga boleh nanya sebelum donasi',
    'Tul',
    'Hah?',
    'Donasi Dulu😫',
    'Jangan tanya gw',
    'mana saya tau, saya kan bot',
    'Ngetik apaan? Burem',
    'Sok asik bgt sama gw kenal juga kagak',
     'Anda siapa? kok nanya nanya ke saya.'
]

const { menuId, menuEn } = require('./text') // Indonesian & English menu

module.exports = msgHandler = async (client = new Client(), message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const blockNumber = await client.getBlockedIds()
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const ownerNumber = '6282111237689@c.us'
        const isOwner = sender.id === ownerNumber
        const isBlocked = blockNumber.includes(sender.id) === true
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false

        // Bot Prefix
        const prefix = '#'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = process.env.UserAgent
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'

        /*/ [BETA] Avoid Spam Message
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        /*/
        if (!isCmd && !isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname)) }
        if (!isCmd && isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname), 'in', color(name || formattedTitle)) }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }

        /*/ [BETA] Avoid Spam Message
         msgFilter.addFilter(from)*/

        switch (command) {
        // Menu and TnC
         case 'statusbot':
        case 'botstat':
        case 'server':
        case 'ping':
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.sendText(from, `Penggunaan RAM: *${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB*\nCPU: *${os.cpus().length}*\n\nStatus :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats\n\nSpeed: ${processTime(t, moment())} _Second_`)
            break
        case 'tnc':
            await client.sendText(from, menuId.textTnC())
            break
        case 'rules':
            await client.sendText(from, menuId.textRules())
            break
        /*case 'masukgrup':
        case 'joingrup':
        case 'masuk':
        case 'join':
            await client.sendText(from, 'Untuk mengundang bot ke grup yang kamu kelola, kamu harus berdonasi terlebih dahulu.\nuntuk info pembayaran donasi ketik : *#donasi*\n\nKirim bukti donasi kalian untuk konfirmasi masuk ke grup ke whatsapp ini : https://wa.me/6282111237689')
            break*/
         case 'readme':
            await client.sendText(from, menuId.textReadme(pushname))
            break
        case 'menu':
        case 'help':
            await client.sendText(from, menuId.textMenu(pushname))
                /*.then(() => ((isGroupMsg) && (isGroupAdmins)) ? client.sendText(from, 'Menu Admin Grup: *#menuadmin*') : null)*/
            break
        case 'menuadmin':
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            await client.sendText(from, menuId.textAdmin())
            break
        case 'donate':
        case 'donasi':
            await client.sendText(from, menuId.textDonasi(pushname))
            break
         case 'iklan':
            await client.sendText(from, menuId.textIklan(pushname))
            break
        // Sticker Creator
        case 'sticker':
        case 's':
        case 'stiker': {
             /*if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam grup!\n\nKenapa hanya digunakan di dalam grup? karena server yang dimiliki bot kentang jadi dibatasi dulu sampai ada biaya untuk mengupgrade servernya.\n\nKalau mau bantu donasi bisa ketik : *#donasi*\nuntuk melihat info pembayaran donasi.', message.id)
*/
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                client.sendImageAsSticker(from, imageBase64).then(() => {
                    /*client.reply(from, 'Untuk membantu bot tetap aktif, kamu bisa bantu bot dengan berdonasi. ketik: *#donasi*\nUntuk melihat info donasi.')*/
                    client.reply(from, 'Hai kak sudah selesai nih,di follow dong Instagram : https://www.instagram.com/vanyourby\n\n*Terima Kasih* ', id)
                    console.log(`Durasi pembuatan ${processTime(t, moment())} Detik`)
                })
            } else if (args[0] === 'nobg') {
                /**
                * This is Premium feature.
                * Check premium feature at https://trakteer.id/red-emperor/showcase or chat Author for Information.
                */
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const mimetypes = isQuotedImage ? quotedMsg.mimetype : mimetype
                const base64img = `data:${mimetypes};base64,${mediaData.toString('base64')}`
                const base64imgnobg = await removebg(base64img)
                return client.sendImageAsSticker(from, base64imgnobg)
                    .then(() => client.reply(from, `Here\'s your sticker \n\nProcessed for ${processTime(moment())} _Second_`))
            } else if (args.length === 1) {
                if (!url.match(isUrl)) { await client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id) }
                client.sendStickerfromUrl(from, url)
                    .then(() => client.reply(from, `Here\'s your sticker \n\nProcessed for ${processTime(moment())} _Second_`))
                    .then((r) => (!r && r !== undefined) ? client.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar. [No Image]') : null)
            } else {
                await client.reply(from, 'Gambarnya mana, kalau gak ada gambar mana bisa buat sticker.', id)
            }
            break
        }
        case 'stikergif':
        case 'stickergif':
        case 'gifstiker':
        case 'gifsticker': {
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return client.reply(from, 'Gagal mengambil kode giphy', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    client.reply(from, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return client.reply(from, 'Gagal mengambil kode giphy', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    client.reply(from, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            } else {
                await client.reply(from, 'Baca dong, ini cuma bisa buat dari link giphy [Giphy Only]', id)
            }
            break
        }
        // Video Downloader //
        case 'ytmp3':
                if (args.length !== 1) return client.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan. [WRONG FORMAT]', id)
                if (!isUrl(url) & !url.includes('youtube.com') || !url.includes('youtu.be')) return client.reply(from, '⚠️ Link tidak valid! [UNVALID]', id)
                client.reply(from, '_Mohon tunggu sebentar_\n\n*NOTE : *Harap menunggu,Waktu proses berdasarkan durasi video.*', id)
                axios.get('https://mhankbarbar.herokuapp.com/api/yta?url=' + url)
                .then(async function (response) {
                    console.log('Get metadata from => ' + args[0])
                    if (response.data.status === 200) {
                        await client.sendFileFromUrl(from, response.data.result, `${response.data.title}.mp3`, `Sukses mengirim file! Diproses selama ${processTime(t, moment())} detik`, null, null, true)
                        .then(() => console.log(`Sukses mengirim file! Diproses selama ${processTime(t, moment())} detik`))
                        .catch((err) => console.error(err))
                    }
                })
                .catch((err) => {
                    console.error(err)
                    client.reply(from, `⚠️ Terjadi kesalahan! [ERR]\n\n${err}`)
                })
            break
            case 'ytmp4':
                if (args.length !== 1) return client.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan. [WRONG FORMAT]', id)
                if (!isUrl(url) & !url.includes('youtube.com') || !url.includes('youtu.be')) return client.reply(from, '⚠️ Link tidak valid! [UNVALID]', id)
                client.reply(from, '_Mohon tunggu sebentar_\n\n*NOTE : *Harap menunggu,Proses waktu bergantung pada durasi video.*', id)
                axios.get('https://mhankbarbar.herokuapp.com/api/ytv?url=' + url)
                .then(async function (response) {
                    console.log('Get metadata from => ' + args[0])
                    if (response.data.status === 200) {
                        await client.sendFileFromUrl(from, response.data.result, `${response.data.title}.mp4`, `Sukses mengirim file! Diproses selama ${processTime(t, moment())} detik`, null, null, true)
                        .then(() => console.log(`Sukses mengirim file! Diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                    }
                })
                .catch((err) => {
                    console.error(err)
                    client.reply(from, `⚠️ Terjadi kesalahan! [ERR]\n\n${err}`)
                })
            break
        case 'tiktok':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, `_Scraping Metadata..._ \n\nSupport Bot Kami Agar Tetap Aktif Dengan Cara Donasi Ke:\nDana: 081283468899\nOVO: 081283468899\nGOPAY: 081283468899\nPULSA TELKOMSEL: 081283468899\n\n*Menerima donasi berapapun jumlahnya 🙏 Terima Kasih.*`, id)
            downloader.tiktok(url).then(async (videoMeta) => {
                const filename = videoMeta.authorMeta.name + '.mp4'
                const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'}`
                await client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Video tanpa watermark tidak tersedia. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0', referer: 'https://www.tiktok.com/' } }, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            }).catch(() => client.reply(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid. [Invalid Link]', id))
            break
        /*case 'ig':
        case 'instagram':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) && !url.includes('instagram.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, `_Scraping Metadata..._\n\nSupport Bot Kami Agar Tetap Aktif Dengan Cara Donasi Ke:\nDana: 081283468899\nOVO: 081283468899\nGOPAY: 081283468899\nPULSA TELKOMSEL: 081283468899\n\n*Menerima donasi berapapun jumlahnya 🙏 Terima Kasih.*`, id)
            downloader.insta(url).then(async (data) => {
                if (data.type == 'GraphSidecar') {
                    if (data.image.length != 0) {
                        data.image.map((x) => client.sendFileFromUrl(from, x, 'photo.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                    if (data.video.length != 0) {
                        data.video.map((x) => client.sendFileFromUrl(from, x.videoUrl, 'video.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                } else if (data.type == 'GraphImage') {
                    client.sendFileFromUrl(from, data.image, 'photo.jpg', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                } else if (data.type == 'GraphVideo') {
                    client.sendFileFromUrl(from, data.video.videoUrl, 'video.mp4', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                }
            })
                .catch((err) => {
                    if (err === 'Not a video') { return client.reply(from, 'Error, tidak ada video di link yang kamu kirim. [Invalid Link]', id) }
                    client.reply(from, 'Error, user private atau link salah [Private or Invalid Link]', id)
                })
            break*/
        case 'ig':
                if (args.length !== 1) return client.reply(from, '⚠️ Format salah! Ketik *#readme* untuk penggunaan. [WRONG FORMAT]', id)
                if (!isUrl(url) && !url.includes('instagram.com')) return client.reply(from, '⚠️ Link tidak valid! [UNVALID]', id)
                client.reply(from, '_*Mohon tunggu sebentar, proses ini akan memakan waktu beberapa menit...*', id)
                axios.get('https://villahollanda.com/api.php?url='+ url)
                .then(function (response) {
                    console.log('IG: ' + args[0])
                    if (response.data.descriptionc === null) {
                        client.reply(from, '🔒 Sepertinya akunnya di-private atau link tidak valid. [PRIVATE OR UNVALID]', id)
                    } else if (response.data.mediatype === 'photo') {
                        client.sendFileFromUrl(from, response.data.descriptionc)
                    } else if (response.data.mediatype === 'video') {
                        client.sendFileFromUrl(from, response.data.descriptionc, 'video.mp4', `Berhasil diproses selama ${processTime(t, moment())} detik`, null, null, true)
                    }
                })
                .catch((err) => {
                        console.error(err)
                        client.reply(from, `⚠️ Terjadi kesalahan! [ERR]\n\n${err}`, id)
                })
            break
        case 'twt':
        case 'twitter':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) & !url.includes('twitter.com') || url.includes('t.co')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, `_Scraping Metadata..._ \n\nSupport Bot Kami Agar Tetap Aktif Dengan Cara Donasi Ke:\nDana: 081283468899\nOVO: 081283468899\nGOPAY: 081283468899\nPULSA TELKOMSEL: 081283468899\n\n*Menerima donasi berapapun jumlahnya 🙏 Terima Kasih.*`, id)
            downloader.tweet(url).then(async (data) => {
                if (data.type === 'video') {
                    const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                    const result = await urlShortener(content[0].url)
                    console.log('Shortlink: ' + result)
                    await client.sendFileFromUrl(from, content[0].url, 'video.mp4', `Link Download: ${result} \n\nProcessed for ${processTime(t, moment())} _Second_`, null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                } else if (data.type === 'photo') {
                    for (let i = 0; i < data.variants.length; i++) {
                        await client.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', null, null, true)
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                }
            })
                .catch(() => client.sendText(from, 'Maaf, link tidak valid atau tidak ada media di link yang kamu kirim. [Invalid Link]'))
            break
        case 'fb':
        case 'facebook':
            if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) && !url.includes('facebook.com')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, '_Scraping Metadata..._ \n\nSupport Bot Kami Agar Tetap Aktif Dengan Cara Donasi Ke:\nDana: 081283468899\nOVO: 081283468899\nGOPAY: 081283468899\nPULSA TELKOMSEL: 081283468899\n\n*Menerima donasi berapapun jumlahnya 🙏 Terima Kasih.*', id)
            downloader.facebook(url).then(async (videoMeta) => {
                const title = videoMeta.response.title
                const thumbnail = videoMeta.response.thumbnail
                const links = videoMeta.response.links
                const shorts = []
                for (let i = 0; i < links.length; i++) {
                    const shortener = await urlShortener(links[i].url)
                    console.log('Shortlink: ' + shortener)
                    links[i].short = shortener
                    shorts.push(links[i])
                }
                const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
                const caption = `Text: ${title} \n\nLink Download: \n${link.join('\n')} \n\nProcessed for ${processTime(t, moment())} _Second_`
                await client.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption, null, null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            })
                .catch((err) => client.reply(from, `Error, url tidak valid atau tidak memuat video. [Invalid Link or No Video] \n\n${err}`, id))
            break
        // Other Command
        case 'ask':
                const question = args.join(' ')
                const answer = responses[Math.floor(Math.random() * (responses.length))]
                if (!question) client.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
                await client.sendText(from, `Pertanyaan: *${question}* \n\nJawaban: ${answer}`)
            break
        case 'koin':
          const side = Math.floor(Math.random() * 2) + 1
          if (side == 1) {
            client.sendStickerfromUrl(from, 'https://i.ibb.co/YTWZrZV/2003-indonesia-500-rupiah-copy.png', { method: 'get' })
          } else {
            client.sendStickerfromUrl(from, 'https://i.ibb.co/bLsRM2P/2003-indonesia-500-rupiah-copy-1.png', { method: 'get' })
          }
          break
        case 'dadu':
          const dice = Math.floor(Math.random() * 6) + 1
          await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png', { method: 'get' })
          break
        case 'news':
          const respons = await axios.get('http://newsapi.org/v2/top-headlines?country=id&apiKey=b2d3b1c264c147ae88dba39998c23279')
          const { totalResults, articles } = respons.data
          res = totalResults
          if (args[1] >= totalResults) {
            res = totalResults
          } else {
            res = args[1]
          }
          i = 0
          pesan = '_*Berita Terbaru Hari Ini*_\n\n'
          for (const isi of articles) {
            i++
            pesan = pesan + i + '. ' + '_' + isi.title + '_' + '\n' + isi.publishedAt + '\n' + isi.description + '\n' + isi.url
            if (i<res) {
              pesen = pesan + '\n\n'
            } else if(i > res){
              break
            }
          }
          await client.sendText(from, pesan)
          break
        case 'ara' :
          client.sendStickerfromUrl(from, 'https://ih1.redbubble.net/image.930182194.9969/st,small,507x507-pad,600x600,f8f8f8.jpg', { method: 'get' })
          break
            case 'nh':
                if (args.length >= 1) {
                    const nuklir = body.split(' ')[1]
                    const nanap = require('nana-api')
                    const nana = new nanap()
                    const {
                        exec
                    } = require('child_process')
                    client.sendText(from, 'Searching...')
                    nana.g(nuklir).then((g => {
                        if (g == 'Book not found') {
                            client.reply(from, '💔️ Book not found', message.id)
                        } else {
                            var url = "https://t.nhentai.net/galleries/" + g.media_id + "/cover.jpg"
                            try {
                                var teks = "English Title  : " + g.title.english.slice("0") + " \n \nJapanese Title : " + g.title.japanese + "\n \n Title   : " + g.title.pretty + "\n \n Code    : " + g.id;
                                exec('nhentai --id=' + g.id + ` -P mantap.pdf -o ./hentong/${g.id}.pdf --format ` + `${g.id}.pdf`, (error, stdout, stderr) => {
                                    client.sendFileFromUrl(from, url, 'hentod.jpg', teks, id)
                                    client.sendFile(from, `./hentong/${g.id}.pdf/${g.id}.pdf.pdf`, `${g.title.pretty}.pdf`, id)
                                    if (error) {
                                        console.log('error : ' + error.message)
                                        return
                                    }
                                    if (stderr) {
                                        console.log('stderr : ' + stderr)
                                        return
                                    }
                                    console.log('stdout : ' + stdout)
                                })
                            } catch {
                                client.reply(from, 'An error has occured', message.id)
                            }
                        }
                    }))
                }
                break
        case 'tts':
         if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!\nsilahkan join ke grupnya : https://chat.whatsapp.com/CgAnPQOxapiAX9uYwTo21y', message.id)
            if (args.length == 0) return client.reply(from, 'Kirim perintah *#tts* [id, en, jp, ar, ru, ko] [teks], contoh *#tts* id halo semua')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
            const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const ttsRu = require('node-gtts')('ru')
            const ttsKo = require('node-gtts')('ko')
            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'Salah Bodoh!!! baca di #readme kalau gak ngerti', message.id)
            if (dataText.length > 1000) return client.reply(from, 'teks terlalu panjang, ngotak dong', message.id)
            var dataBhs = body.slice(5, 7)
            if (dataBhs == 'id') {
                ttsId.save('./tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './tts/resId.mp3', message.id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './tts/resEn.mp3', message.id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './tts/resJp.mp3', message.id)
                })
            } else if (dataBhs == 'ar') {
                ttsAr.save('./tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './tts/resAr.mp3', message.id)
                })
            } else if (dataBhs == 'ru') {
                ttsRu.save('./tts/resRu.mp3', dataText, function () {
                    client.sendPtt(from, './tts/resRu.mp3', message.id)
                })
            } else if (dataBhs == 'ko') {
                ttsKo.save('./tts/resKo.mp3', dataText, function () {
                    client.sendPtt(from, './tts/resKo.mp3', message.id)
                })
            } else {
                client.reply(from, 'Masukin kode bahasanya goblok : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, [ar] untuk arab, [ru] untuk russia, dan [ko] untuk korea\n\nContoh : #tts id selamat pagi', message.id)
            }
            break
        case 'teksmaker':
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            } else {
                await client.reply(from, 'Tidak ada gambar! Untuk membuka cara penggnaan kirim #menu [Wrong Format]', id)
            }
            break
        case 'rmeme':
                meme.random()
                    .then(({ subreddit, title, url, author, nsfw}) => {
                        client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}\nTag: ${subreddit}\nAuthor: ${author}\nNSFW: ${nsfw}`, null, null, true)
                    })
                    .catch((err) => console.error(err))
            break
        case 'resi':
            if (args.length !== 2) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return client.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
            cekResi(args[0], args[1]).then((result) => client.sendText(from, result))
            break
        case 'translate':
            if (args.length != 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!quotedMsg) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, args[0])
                .then((result) => client.sendText(from, result))
                .catch(() => client.sendText(from, 'Error, Kode bahasa salah.'))
            break
        case 'ceklokasi':
            if (quotedMsg.type !== 'location') return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) client.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
            let data = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                data += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const text = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${data}`
            client.sendText(from, text)
            break
        case 'wait':
            if (isMedia) {
                const fetch = require('node-fetch')
                const mediaData = await decryptMedia(message, uaOverride)
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Searching....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                    if (resolt.docs && resolt.docs.length <= 0) {
                        client.reply(from, 'Maaf, saya tidak tau ini anime apa', message.id)
                    }
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                        teks = 'Saya memiliki keyakinan rendah dalam hal ini :\n'
                    }
                    teks += `Title : ${title}\nTitle chinese : ${title_chinese}\nTitle Romaji : ${title_romaji}\nTitle English : ${title_english}\n`
                    teks += `Eps : ${episode.toString()}\n`
                    teks += `Kesamaan : ${(similarity * 100).toFixed(1)}%\n\n*Kalau mau donasi untuk bot biar tetap aktif beroperasi bisa ketik : #donasi*`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                        client.sendFileFromUrl(from, video, 'nimek.mp4', teks, message.id)
                    })
                .catch(err => {
                    client.reply(from, 'Error !', id)
                })
            } else {
                client.sendFile(from, './anime/tutod.jpg', 'Tutor.jpg', 'Nih contohnya', message.id)
            }
            break
        case 'leaveall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', message.id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Succes leave all group!', message.id)
            break
        case 'clearall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', message.id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Succes clear all chat!', message.id)
            break
            case 'bc':
            if(!isOwner) return client.reply(from, 'Perintah ini hanya untuk owner bot!', message.id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) client.sendText(ids, `*[ Lokub Bot ]*\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', message.id)
            break
        // Group Commands (group admin only)
        case 'kickall':
            if (!isGroupMsg) return await client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
           /*const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isGroupOwner) return await client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)*/
            if (!isBotGroupAdmins) return await client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
            await client.reply(from, 'Succes kick all member', id)
            break
        case 'kick':
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup! [Bot Not Admin]', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            await client.sendTextWithMentions(from, `Request diterima, mengeluarkan:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText(from, 'Admin grup mau lu kick?,Iri bilang bos:v.')
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'promote':
            if (!isGroupMsg) return await client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return await client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return await client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup! [Bot not Admin]', id)
            if (mentionedJidList.length != 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format, Only 1 user]', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Maaf, user tersebut sudah menjadi admin. [Bot is Admin]', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
            break
        case 'demote':
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup! [Bot not Admin]', id)
            if (mentionedJidList.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format, Only 1 user]', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Maaf, user tersebut tidak menjadi admin. [user not Admin]', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Request diterima, menghapus jabatan @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case 'add':
            if(!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', message.id)
            if(args.length == 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#add* 628xxxxx', message.id)
            if(!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', message.id)
            try {
                await client.addParticipant(from,`${body.slice(5)}@c.us`)
            } catch {
                client.reply(from, `Tidak dapat menambahkan ${body.slice(5)} mungkin karena di private`, message.id)
            }
            break
        case 'bye':
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            client.sendText(from, 'Good bye... ( ⇀‸↼‶ )').then(() => client.leaveGroup(groupId))
            break
        case 'listblock':
            if(!isOwner) return client.reply(from, 'Perintah ini hanya untuk owner bot!', message.id)
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, hih, id)
            break
        case 'del':
            /*if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)*/
            if (!quotedMsg) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
       case 'tagall':
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            const mentions = mentionList(sender.id, botNumber, groupMembers)
            await client.sendTextWithMentions(from, `Halo para sider, ${pushname} memanggilmu!!!\n${mentions}`)
            break
         case 'adminlist':
            if (!isGroupMsg) return await client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await sleep(2000)
            await client.sendTextWithMentions(from, mimin)
            break
        case 'ownergrup':
            if (!isGroupMsg) return await client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
            
            // FUN MENU //
        case 'lirik':
            if (args.length == 0) return client.reply(from, 'Kirim perintah *#lirik* judul lagu, contoh *#lirik* aku bukan boneka', message.id)
            const lagu = body.slice(7)
            console.log(lagu)
            const lirik = await liriklagu(lagu)
            client.sendText(from, lirik)
            break
        case 'quote' :
        case 'quotes' :
            client.sendText(from, quotedd())
            break
        /*case 'waifu' :
        { const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/Animewallpaper')
          const { title, url, author, postLink } = response1.data
          await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}\n\nAuthor : ${author}\n\nSource : ${postLink}`)
         }
          break
          case 'waifu':
                client.reply(from, '_Sedang mencari..._', id)
                waifu.random()
                .then(({ title, url, author, postLink }) => {
                    client.sendFileFromUrl(from, `${url}`, 'sansekaibot.jpg', `${title}\n\nAuthor : ${author}\n\nSource : ${postLink}`, null, null, true)
                })
                .catch((err) => console.error(err))
            break*/
          case 'waifu':
                client.reply(from, '_Sedang Mencari Waifu_', id)
                waifu.random()
                    .then(({ url }) => {
                        client.sendFileFromUrl(from, url, 'waifu.jpg', null, null, true)
                    })
                    .catch((err) => {
                        console.error(err)
                        client.reply(from, `Terjadi kesalahan! [ERR]\n\n${err}`)
                    })
                break
          case 'neko':          
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Lucu gak? ')
            break
        case 'wallanime' :
            const walnime = ['https://wallpaperaccess.com/full/395986.jpg','https://wallpaperaccess.com/full/21628.jpg','https://wallpaperaccess.com/full/21622.jpg','https://wallpaperaccess.com/full/21612.jpg','https://wallpaperaccess.com/full/21611.png','https://wallpaperaccess.com/full/21597.jpg','https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://wallpaperaccess.com/full/21591.jpg','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            client.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', message.id)
            break
        case 'pokemon':
            q7 = Math.floor(Math.random() * 890) + 1;
            client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',)
            break
         case 'inu':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Inu')
            break
        case 'ptl':
            const pptl = ["https://i.pinimg.com/564x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/236x/98/08/1c/98081c4dffde1c89c444db4dc1912d2d.jpg","https://i.pinimg.com/236x/a7/e2/fe/a7e2fee8b0abef9d9ecc8885557a4e91.jpg","https://i.pinimg.com/236x/ee/ae/76/eeae769648dfaa18cac66f1d0be8c160.jpg","https://i.pinimg.com/236x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/564x/78/7c/49/787c4924083a9424a900e8f1f4fdf05f.jpg","https://i.pinimg.com/236x/eb/05/dc/eb05dc1c306f69dd43b7cae7cbe03d27.jpg","https://i.pinimg.com/236x/d0/1b/40/d01b40691c68b84489f938b939a13871.jpg","https://i.pinimg.com/236x/31/f3/06/31f3065fa218856d7650e84b000d98ab.jpg","https://i.pinimg.com/236x/4a/e5/06/4ae5061a5c594d3fdf193544697ba081.jpg","https://i.pinimg.com/236x/56/45/dc/5645dc4a4a60ac5b2320ce63c8233d6a.jpg","https://i.pinimg.com/236x/7f/ad/82/7fad82eec0fa64a41728c9868a608e73.jpg","https://i.pinimg.com/236x/ce/f8/aa/cef8aa0c963170540a96406b6e54991c.jpg","https://i.pinimg.com/236x/77/02/34/77023447b040aef001b971e0defc73e3.jpg","https://i.pinimg.com/236x/4a/5c/38/4a5c38d39687f76004a097011ae44c7d.jpg","https://i.pinimg.com/236x/41/72/af/4172af2053e54ec6de5e221e884ab91b.jpg","https://i.pinimg.com/236x/26/63/ef/2663ef4d4ecfc935a6a2b51364f80c2b.jpg","https://i.pinimg.com/236x/2b/cb/48/2bcb487b6d398e8030814c7a6c5a641d.jpg","https://i.pinimg.com/236x/62/da/23/62da234d941080696428e6d4deec6d73.jpg","https://i.pinimg.com/236x/d4/f3/40/d4f340e614cc4f69bf9a31036e3d03c5.jpg","https://i.pinimg.com/236x/d4/97/dd/d497dd29ca202be46111f1d9e62ffa65.jpg","https://i.pinimg.com/564x/52/35/66/523566d43058e26bf23150ac064cfdaa.jpg","https://i.pinimg.com/236x/36/e5/27/36e52782f8d10e4f97ec4dbbc97b7e67.jpg","https://i.pinimg.com/236x/02/a0/33/02a033625cb51e0c878e6df2d8d00643.jpg","https://i.pinimg.com/236x/30/9b/04/309b04d4a498addc6e4dd9d9cdfa57a9.jpg","https://i.pinimg.com/236x/9e/1d/ef/9e1def3b7ce4084b7c64693f15b8bea9.jpg","https://i.pinimg.com/236x/e1/8f/a2/e18fa21af74c28e439f1eb4c60e5858a.jpg","https://i.pinimg.com/236x/22/d9/22/22d9220de8619001fe1b27a2211d477e.jpg","https://i.pinimg.com/236x/af/ac/4d/afac4d11679184f557d9294c2270552d.jpg","https://i.pinimg.com/564x/52/be/c9/52bec924b5bdc0d761cfb1160865b5a1.jpg","https://i.pinimg.com/236x/1a/5a/3c/1a5a3cffd0d936cd4969028668530a15.jpg"]
            let pep = pptl[Math.floor(Math.random() * pptl.length)]
            client.sendFileFromUrl(from, pep, 'pptl.jpg', 'Follow ig : https://www.instagram.com/ptl_repost untuk mendapatkan penyegar timeline lebih banyak', message.id)
            break
        case 'qrcode':
           if(!args.lenght >= 2) return
           let qrcodes = body.slice(8)
           await client.sendFileFromUrl(from, `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${qrcodes}`, 'gambar.png', 'Process sukses!')
           break
        /*case 'walldekstop':
            client.sendFileFromUrl(from, 'https://source.unsplash.com/1920x1080/?nature','wp.jpeg')
            break
        case 'wallhp':
            client.sendFileFromUrl(from, 'https://source.unsplash.com/1080x1920/?nature','wp.jpeg')
            break*/
        case 'wallpaper':
        case 'walpaper':
                client.reply(from, '_Sedang mencari..._', id)
                wallpaper.random()
                .then(({ title, url, author, postLink }) => {
                    client.sendFileFromUrl(from, `${url}`, 'nikkixploit.com.jpg', `${title}\n\nAuthor : ${author}\n\nSource : ${postLink}`, null, null, true)
                })
                .catch((err) => console.error(err))
            break
            case '#wiki':
            if (args.length === 1) return await client.reply(from, 'Kirim perintah *#wiki [query]*\nContoh : *#wiki john wick*', id)
            const query_ = body.slice(6)
            const wiki = await get.get('https://mhankbarbar.herokuapp.com/api/wiki?q='+ query_).json()
            if (wiki.error) {
                await client.reply(from, wiki.error, id)
            } else {
                await client.reply(from, `➸ *Query* : ${query_}\n\n➸ *Result* : ${wiki.result}`, id)
            }
            break
        case 'husbu':
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
        case 'qnime':
        case 'qanime':
        case 'quoteanime':
                        if(args[1]){
                            if(args[1] === 'anime'){
                                const anime = body.slice(13)
                                axios.get('https://animechanapi.xyz/api/quotes?anime='+anime).then(({ data }) => {
                                    let quote = data.data[0].quote 
                                    let char = data.data[0].character
                                    let anime = data.data[0].anime
                                    client.sendText(from, `"${quote}"\n\nCharacter : ${char}\nAnime : ${anime}`)
                                }).catch(err => {
                                    client.sendText('Quote Char/Anime tidak ditemukan!')
                                })
                            }else{
                                const char = body.slice(12)
                                axios.get('https://animechanapi.xyz/api/quotes?char='+char).then(({ data }) => {
                                    let quote = data.data[0].quote 
                                    let char = data.data[0].character
                                    let anime = data.data[0].anime
                                    client.sendText(from, `"${quote}"\n\nCharacter : ${char}\nAnime : ${anime}`)
                                }).catch(err => {
                                    client.sendText('Quote Char/Anime tidak ditemukan!')
                                })
                            }
                        }else{
                            axios.get('https://animechanapi.xyz/api/quotes/random').then(({ data }) => {
                                let quote = data.data[0].quote 
                                let char = data.data[0].character
                                let anime = data.data[0].anime
                                client.sendText(from, `"${quote}"\n\nCharacter : ${char}\nAnime : ${anime}`)                               
                            }).catch(err => {
                                console.log(err)
                            })
                        }
            break
        /*case 'igstalk':
                        if(!args.lenght >= 2) return
                        if(!args[1]) return
                        let usrname = args[1]
                        if (usrname.includes('@')) {
                            usrname = usrname.replace('@', '');
                        }
                        const browser = await puppeteer.launch({
                            headless: true,
                            args: [
                                "--no-sandbox",
                                "--disable-setuid-sandbox",
                                "--disable-dev-shm-usage",
                                "--disable-accelerated-2d-canvas",
                                "--disable-gpu",
                                "--window-size=1920x1080",
                            ],
                            });
                            const page = await browser.newPage();
                            await page.setRequestInterception(true);
                            page.on('request', request => {
                            if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
                                request.abort();
                            else
                                request.continue();
                            });
                            await page
                            .goto(`https://www.mystalk.net/profile/${usrname}/`,{
                                waitUntil: "networkidle2",
                            })
                            .then(async () => {
                            page.setViewport({ width: 420, height: 840 , deviceScaleFactor:2});
                            const post = await (await (await page.$('#section-main > div.user-profile-area > div > div > div.col-md-5 > div > span:nth-child(1) > b')).getProperty('innerHTML')).jsonValue();
                            let prvate;
                            const username = await (await (await page.$('#section-main > div.user-profile-area > div > div > div.col-md-7 > div > div > div > h1 > span.user-name')).getProperty('innerHTML')).jsonValue();
                            const full_name = await (await (await page.$('#section-main > div.user-profile-area > div > div > div.col-md-7 > div > div > div > h1 > span.name')).getProperty('innerHTML')).jsonValue();
                            const biography = await (await (await page.$('#section-main > div.user-profile-area > div > div > div.col-md-7 > div > div > p')).getProperty('innerHTML')).jsonValue();
                            if(await page.$('#section-main > div.private-warning > div > span') !== null) prvate = true;
                            else prvate = false;
                            const followers = await (await (await page.$('#section-main > div.user-profile-area > div > div > div.col-md-5 > div > span:nth-child(2) > b')).getProperty('innerHTML')).jsonValue();
                            const followed = await (await (await page.$('#section-main > div.user-profile-area > div > div > div.col-md-5 > div > span:nth-child(3) > b')).getProperty('innerHTML')).jsonValue();
                            if (prvate === true) {
                                prvate = 'Iya';
                            } else {
                                prvate = 'Tidak';
                            }
                            let hasil = `_*Instagram Stalker*_
~> Username : ${username}
~> Nama : ${full_name}
~> Jumlah post : ${post}
~> Followed : ${followed} followed
~> Followers : ${followers} followers
~> Bio :
-------------------------------------------------------------------
${biography}
-------------------------------------------------------------------
_*Processing Sukses Vanyourby BOT*_`
                            client.sendText(from, hasil);
                            limitAdd(serial);
                            browser.close();
                            }).catch((err) => {
                                console.log(err)
                                client.sendText(from,`[GAGAL] Username tidak ditemukan!`
                            );
                            browser.close();
                            });
        break*/
     /*case 'fanart': {
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/anime',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/nime.jpg', (error, stdout, stderr) => {
client.sendFile(from, './anime/nime.jpg', 'nime.jpg', 'Hai kak', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
case 'fanart18': {
const cheerio = require('cheerio');
const request = require('request');

const { exec } = require("child_process");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://api.computerfreaker.cf/v1/hentai',
 
},function(error, response, body){
    let $ = cheerio.load(body);
    var d = JSON.parse(body);
console.log(d.url); 
exec('wget "' + d.url + '" -O anime/ok.jpg', (error, stdout, stderr) => {
client.sendFile(from, './anime/ok.jpg', 'ok.jpg', 'Hai kak', message.id)

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}
break
          case 'brainly':
            if (args.length >= 1){
                const BrainlySearch = require('../../lib/brainly')
                let tanya = body.slice(9)
                console.log(tanya.length-1)
                let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return client.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                let quest = body.slice(9)
                client.reply(from, `══✪〘 *Pertanyaan* 〙✪══\n\n_${quest.split('.')[0]}_\n\n╔══✪〘 Jumlah jawaban 〙✪══\n╚═➥ ${Number(jum)}`, message.id)
                BrainlySearch(quest.split('.')[0],Number(jum), function(res){
                    console.log(res)
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            client.reply(from, `══✪〘 *Pertanyaan* 〙✪══\n\n_${x.pertanyaan}_\n\n══✪〘 *Jawaban* 〙✪══\n\n${x.jawaban.judulJawaban}\n`, message.id)
                        } else {
                            client.reply(from, `══✪〘 *Pertanyaan* 〙✪══\n\n${x.pertanyaan}\n\n══✪〘 *Jawaban* 〙✪══\n\n${x.jawaban.judulJawaban}\n\n╔══✪〘 *Link foto jawaban* 〙✪══\n╠➣${x.jawaban.fotoJawaban.join('\n')}`)
                        }
                    })
                })
            } else {
                client.reply(from, 'Usage :\n!brainly [pertanyaan] [.jumlah]\n\nEx : \n!brainly NKRI .2', message.id)
            }
            break
            case 'wall':
            if (args.length == 0) return client.reply(from, 'Kirim perintah *!wall [query]*', id)
            const query = body.slice(6)
            const walls = await wall(query)
            console.log(walls)
            await client.sendImageFromUrl(from, walls, 'walls.jpg', '', id)
            break
           case 'quotemaker':
            arg = body.trim().split('|')
            if (arg.length >= 3) {
                client.reply(from, 'Tunggu yaa, sedang proses . . .', message.id) 
                const quotes = arg[1]
                const author = arg[2]
                const theme = arg[3]
                try {
                    const resolt = await quotemaker(quotes, author, theme)
                    client.sendFile(from, resolt, 'quotesmaker.jpg','neh...')
                } catch {
                    client.reply(from, 'Maaf quotesmaker gagal di proses:(', message.id)
                }
            } else {
                client.reply(from, 'Usage: \n!quotemaker |teks|watermark|theme\n\nEx :\n!quotemaker |ini contoh|bicit|random', message.id)
            }
            break*/
            
            // NSFW MENU //
            case 'randomhentai':
            const hentai = await randomNimek('hentai')
            if (hentai.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, hentai, `Hentai${ext}`, 'Hentai!', id)
            break
        case 'randomnsfwneko':
            const nsfwneko = await randomNimek('nsfw')
            if (nsfwneko.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nsfwneko, `nsfwNeko${ext}`, 'Nsfwneko!', id)
            break
        case 'randomnekonime':
            const nekonime = await randomNimek('neko')
            if (nekonime.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nekonime, `Nekonime${ext}`, 'Nekonime!', id)
            break
        case 'randomtrapnime':
            const trap = await randomNimek('trap')
            if (trap.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, trap, `trapnime${ext}`, 'Trapnime!', id)
            break
        case 'randomanime':
            const nime = await randomNimek('anime')
            if (nime.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nime, `Randomanime${ext}`, 'Randomanime!', id)
            break
            case 'lewds':
            case 'lewd':
                client.reply(from, '_Sedang mencari..._', id)
                lewd.random()
                .then(({ subreddit, title, url, author }) => {
                    client.sendFileFromUrl(from, `${url}`, 'lewd.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                })
                .catch((err) => console.error(err))
            break
            case 'fetish':
                let request = args.join(' ')
                if (!request) {
                    client.reply(from, '⚠️ Silakan masukkan tag yang tersedia di *#readme*!')
                }
                client.reply(from, '_Sedang mencari..._', id)

                if (request === 'armpits') {
                    fetish.armpits()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'feets') {
                    fetish.feets()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'thighs') {
                    fetish.thighs()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'booty') {
                    fetish.booty()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'boobs') {
                    fetish.boobs()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'necks') {
                    fetish.necks()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'belly') {
                    fetish.belly()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'sideboobs') {
                    fetish.sideboobs()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else if (request === 'ahegao') {
                    fetish.ahegao()
                        .then(({subreddit, title, url, author}) => {
                            client.sendFileFromUrl(from, `${url}`, 'fetish.jpg', `${title}\nTag: r/${subreddit}\nAuthor: u/${author}`, null, null, true)
                        })
                        .catch((err) => console.error(err))
                } else {
                    client.reply(from, '🙏 Maaf tag belum tersedia. Silakan lihat tag yang tersedia di *#readme*')
                }
            break
        default:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
