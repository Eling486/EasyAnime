const express = require('express');
const router = express.Router();
const { sendJSON } = require('../../../response')
const { login } = require('../../../user')

router.post('/', async function (req, res, next) {
  let result = await login(req.body.username, req.body.password)
  if(result.code < 0){
    sendJSON({
      req, res,
      code: result.code,
    });
    return next();
  }
  sendJSON({
    req, res,
    code: 0,
    data: result.data
  });
  return next();
});


module.exports = router;
