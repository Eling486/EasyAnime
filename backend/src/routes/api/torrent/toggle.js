const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')
const { torrent } = require('../../../utils')

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

    let toggleRes = await torrent.toggleEpTorrent(req.body.tid_from, req.body.tid_to)
    if (!toggleRes) {
        sendJSON({
            req, res,
            code: -500
        });
        return next();
    }

    sendJSON({
        req, res,
        code: 0,
        data: toggleRes
    });

    return next();
})

module.exports = router;