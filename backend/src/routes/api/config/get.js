const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')
const { torrent } = require('../../../utils')

router.get('/', async function (req, res, next) {
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

    sendJSON({
        req, res,
        code: 0,
        data: global.config.config
    });

    return next();
})

module.exports = router;