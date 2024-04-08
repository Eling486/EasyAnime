const axios = require('axios')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto');

const poster = {
    downloadPoster: async (imgUrl) => {
        return new Promise((resolve, reject) => {
            if(!imgUrl){
                return reject(null)
            }
            axios.request({
                url: imgUrl,
                method: 'GET',
                responseType: 'stream'
            }).then(res => {
                let ext = path.extname(imgUrl)
                if(!ext) ext = 'jpg';
                let filename = `${crypto.createHash('md5').update(imgUrl).digest('hex')}${ext}`
                let posterPathAbs = path.join(path.resolve('../data/public/poster'), filename)
                let posterPath = `/public/poster/${filename}`
                res.data.pipe(fs.createWriteStream(posterPathAbs))
                return resolve(posterPath)
            }).catch((err) => {
                global.logger.error(err)
                return reject(err)
            });
        })
    }
}

module.exports = poster;