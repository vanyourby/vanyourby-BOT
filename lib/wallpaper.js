const { fetchJson } = require ('../utils/fetcher')

const random = () => new Promise((resolve, reject) => {
    const subreddits = ['phonewallpaper', 'wallpaper', 'rainbow', 'darkwallpaper', 'gamewallpaper', 'mountains']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('Looking for Sansekai Bot Wallpaper on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

module.exports = {
    random
}
