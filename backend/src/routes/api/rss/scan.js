const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')
const { rss, torrent } = require('../../../utils')

router.get('/', async function (req, res, next) {
    let loginState = await validate(req)
    if (!loginState.logined) {
        sendJSON({
            req, res,
            code: -50101
        });
        return next();
    }

    let result = await rss.scanRSS(req.query.rid)

    sendJSON({
        req, res,
        code: 0,
        data: result
    });

    await torrent.saveScan(result)
    await torrent.filenameRecognize()
    await torrent.torrentDownloadScan()

    return next();
})

module.exports = router;