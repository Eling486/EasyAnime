const express = require('express');
const bodyParser = require('body-parser')
const http = require('http');
const https = require('https');
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

if (!fs.existsSync(path.resolve('../data'))) {
    fs.mkdirSync(path.resolve('../data'), { recursive: true })
}

if (!fs.existsSync(path.resolve('../keys'))) {
    fs.mkdirSync(path.resolve('../keys'), { recursive: true })
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicExponent: 0x10001,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'EasyAnime'
        }
    });
    fs.writeFileSync(path.resolve(path.join('../keys', 'private.pem')), privateKey, 'utf8');
    fs.writeFileSync(path.resolve(path.join('../keys', 'public.pem')), publicKey, 'utf8');
}

const { normalizePort } = require('./utils/network');
const onFinished = require('on-finished');
const { sendJSON } = require('./response')
const json2Router = require('./router')
const db = require('./db')
const Config = require('./config')
const qBittorrent = require('./qBittorrent')

if (!fs.existsSync(path.resolve('../data/public'))) {
    fs.mkdirSync(path.resolve('../data/public/poster'), { recursive: true })
}

if (!fs.existsSync(path.resolve('../data/logs'))) {
    fs.mkdirSync(path.resolve('../data/logs'), { recursive: true })
}
if (fs.existsSync(path.resolve('../data/logs/output.log'))) {
    fs.unlinkSync(path.resolve('../data/logs/output.log'))
}
fs.writeFileSync(path.resolve('../data/logs/output.log'),
    `███████╗ █████╗ ███████╗██╗   ██╗ █████╗ ███╗   ██╗██╗███╗   ███╗███████╗
██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██╔══██╗████╗  ██║██║████╗ ████║██╔════╝
█████╗  ███████║███████╗ ╚████╔╝ ███████║██╔██╗ ██║██║██╔████╔██║█████╗  
██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║██║╚██╔╝██║██╔══╝  
███████╗██║  ██║███████║   ██║   ██║  ██║██║ ╚████║██║██║ ╚═╝ ██║███████╗
╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚══════╝\n`)

// Logger
global.logger = require('./logger')
global.config = new Config();

// Database
global.db = new db();

global.qb = new qBittorrent();

const app = express();

app.set('x-powered-by', false)

let httpServer, httpsServer

if (global.config.config.http) {
    let httpPort = normalizePort(global.config.config.port[0] || global.config.config.port);
    app.set('http_port', httpPort);
    httpServer = http.createServer(app);
    httpServer.listen(httpPort);
    httpServer.on('error', onError);
    httpServer.on('listening', () => {
        let addr = httpServer.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        global.logger.info('HTTP server is listening on ' + bind);
        let address = 'localhost'
        if (addr.address !== '::') {
            address = addr.address
        }
        global.logger.info(`http://${address}:${addr.port}/`);
    });
}

if (global.config.config.https) {
    let httpsPort = normalizePort(global.config.config.port[1] || global.config.config.port);
    app.set('https_port', httpsPort);
    let keyPath = path.resolve(global.config.config.ca.key)
    let certPath = path.resolve(global.config.config.ca.cert)
    if (fs.existsSync(keyPath) || fs.existsSync(certPath)) {
        let privateKey = fs.readFileSync(keyPath, 'utf8');
        let certificate = fs.readFileSync(certPath, 'utf8');
        httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);
        httpsServer.listen(httpsPort);
        httpsServer.on('error', onError);
        httpsServer.on('listening', () => {
            let addr = httpsServer.address();
            let bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            global.logger.info('HTTPS server is listening on ' + bind);
        });
    } else {
        global.logger.error('Certificate file not found!');
    }

}

function onError(error) {
    let port = error.port
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            global.logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            global.logger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        //'Content-Type': 'application/json; charset=utf-8',
    })

    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

// Frontend
app.use('/assets', express.static(path.resolve('./src/ui/assets')));
app.use('/public', express.static(path.resolve('../data/public')));
app.use('/favicon.ico', express.static(path.resolve('./src/ui/favicon.ico')));
app.get('/', async function (req, res, next) {
    res.set({ 'Content-Type': 'text/html; charset=utf-8' })
    return res.sendFile(path.resolve('./src/ui/index.html'))
});
app.get('/:type*', async function (req, res, next) {
    if (req.params.type == 'api') {
        return next();
    }
    res.set({ 'Content-Type': 'text/html; charset=utf-8' })
    return res.sendFile(path.resolve('./src/ui/index.html'))
});

// ScheduleManager
const ScheduleManager = require('./job')
global.sm = new ScheduleManager();


app.use(function (req, res, next) {
    const _json = res.json;
    let _body = null;
    res.json = function (body) {
        _body = body;
        _json.apply(res, arguments);
    };
    let logData = {
        method: req.method,
        ip: req.ip,
        url: req.url,
        body: req.body,
        query: req.query,
        headers: req.headers,
        host: req.headers.host,
        cookie: req.headers.cookie,
        user_agent: req.headers['user-agent']
    };
    onFinished(res, () => {
        logData.status_code = res.statusCode;
        if (_body) {
            logData.code = _body.code
            logData.msg = _body.msg
        }
        if (logData.url !== '/favicon.ico') {
            global.logger.network(logData.method, logData);
        }
    })
    next();
})

let routerList = json2Router(path.join(__dirname, '../routes.json'))

for (let key in routerList) {
    let addRouter = require(`${routerList[key]}`);
    app.use(key, addRouter);
}

// 404 Router
app.use(function (req, res, next) {
    sendJSON({
        req, res,
        code: -404
    })
})



console.log("███████╗ █████╗ ███████╗██╗   ██╗ █████╗ ███╗   ██╗██╗███╗   ███╗███████╗")
console.log("██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██╔══██╗████╗  ██║██║████╗ ████║██╔════╝")
console.log("█████╗  ███████║███████╗ ╚████╔╝ ███████║██╔██╗ ██║██║██╔████╔██║█████╗  ")
console.log("██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║██║╚██╔╝██║██╔══╝  ")
console.log("███████╗██║  ██║███████║   ██║   ██║  ██║██║ ╚████║██║██║ ╚═╝ ██║███████╗")
console.log("╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚══════╝")



/*
process.on('uncaughtException', (err) => {
    global.logger.error(err);
});
*/
module.exports = app