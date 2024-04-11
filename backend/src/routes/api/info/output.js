const express = require('express');
const router = express.Router();
const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { sendJSON } = require('../../../response')
const { validate } = require('../../../user')

router.get('/', async function (req, res, next) {
    let loginState = await validate(req)
    if (!loginState.logined) {
        sendJSON({
            req, res,
            code: -50101
        });
        return next();
    }

    let startPosition = Number(req.query.start);

    let prePage = 200
    let filePath = path.resolve('../data/logs/output.log')
    let stats = fs.statSync(filePath)
    const fileSize = stats.size;
    if(!startPosition) {
        startPosition = fileSize - 1024 * prePage
    }
    if(startPosition < 0) startPosition = 0;

    // 创建可读流
    const readStream = fs.createReadStream(filePath, { start: startPosition });
    const rl = readline.createInterface({ input: readStream });

    const lines = [];
    let lineIndex = 0

    // 逐行读取文件内容
    rl.on('line', (line) => {
        line = line.replace(/ /g,'&nbsp;')
        lines.push([lineIndex, line]);
        if (lines.length > prePage) {
            lines.shift();
        }
        lineIndex++
    });

    // 读取完毕
    rl.on('close', () => {
        sendJSON({
            req, res,
            code: 0,
            data: {
                content: lines,
                file_size: fileSize
            }
        });
        return next();
    });
})

module.exports = router;