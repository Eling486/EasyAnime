const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')
const { anime, rss, torrent } = require('../../../utils')

router.post('/', async function (req, res, next) {
    let loginState = await validate(req)
    if (!loginState.logined) {
        sendJSON({
            req, res,
            code: -50101
        });
        return next();
    }

    if (!loginState.payload.is_admin) {
        sendJSON({
            req, res,
            code: -50102
        });
        return next();
    }
    
    if(!req.body.meta) {
        sendJSON({
            req, res,
            code: -503,
        });
        return next();
    }

    let meta = JSON.parse(req.body.meta)

    let data = await rss.addRSS({
        title: meta.title,
        name: meta.name,
        url: meta.url,
        source: meta.source,
        meta: JSON.stringify(meta.rss_meta),
        filter: JSON.stringify(meta.filter) || JSON.stringify(global.config.config.filter),
        is_subscribe: meta.is_subscribe
    })

    if (data == -1) {
        sendJSON({
            req, res,
            code: -500
        });
        return next();
    }
    
    let rid = data.rid
    let new_rss = data.new_rss

    let aid = null

    if(meta.rss_meta.type == 'anime'){
        aid = await anime.addAnimeByRID(rid, {
            filter: req.body.filter || JSON.stringify(global.config.config.filter),
            save_path: req.body.save_path || global.config.config.save_path,
            is_subscribe: req.body.is_subscribe || global.config.config.subscribe
        })
        if(aid){
            await global.db.rss.updateAid(rid, aid)
        }
    }

    let resData = {
        rid,
        new_rss
    }

    if(aid){
        resData['aid'] = aid
    }

    sendJSON({
        req, res,
        code: 0,
        data: resData
    });

    let result = await rss.scanRSS(rid)
    await torrent.saveScan(result)
    await torrent.filenameRecognize()
    await torrent.torrentDownloadScan()

    return next();
})

module.exports = router;