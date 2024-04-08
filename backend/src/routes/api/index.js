const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../response')

router.get('/', async function (req, res, next) {
  sendJSON({
    req, res,
    code: 0,
    msg: 'EasyAnime正常运行中'
  });
  next();
});


module.exports = router;
