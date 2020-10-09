const { fetchJson } = require('../utils/fetcher')

const random = () => new Promise((resolve, reject) => {
    const type = ['waifu', 'neko']
    const randType = type[Math.random() * type.length | 0]
    console.log('Looking for waifu sansekai bot images on ' + randType)
    fetchJson('https://waifu.pics/api/sfw/' + randType)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

module.exports = {
    random
}

/*const { fetchJson } = require ('../utils/fetcher')

const random = () => new Promise((resolve, reject) => {
    const subreddits = ['waifu', 'waifus', 'animewallpaper']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('Looking for Sansekai Bot Waifus on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

module.exports = {
    random
}*/
