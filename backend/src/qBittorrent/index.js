const path = require('path')
const fs = require('fs')
const { qBittorrentClient } = require('@robertklep/qbittorrent');

class qBit {
    constructor() {
        this.init()
        return this
    }

    init() {
        this.host = global.config.config.qBittorrent.host
        this.username = global.config.config.qBittorrent.username
        this.password = global.config.config.qBittorrent.password
        this.cookie = null
        this.client = new qBittorrentClient(`http://${this.host}`, this.username, this.password);
    }

    async add(url, fileName, savePath) {
        let hash = url.match(/\/(\w+).torrent/)[1]
        
        let resInfoHash = await this.client.torrents.info({
            hashes: hash
        });
        if (resInfoHash.length > 0) return [hash]
        let addObj = {
            urls: url,
            tags: 'EasyAnime',
            savepath: savePath,
            root_folder: true
        }
        if (fileName) addObj['rename'] = fileName
        const resAdd = await this.client.torrents.add(addObj);
        if (resAdd !== 'Ok.') return null;
        return hash
    }

    async delete(hash, keepFiles = true) {
        await this.client.torrents.delete(hash, keepFiles);
        let resInfoHash = await this.client.torrents.info({
            hashes: hash
        });
        if(resInfoHash.length > 0) return null;
        return hash
    }

    restart() {
        this.init()
        return this
    }
}

module.exports = qBit