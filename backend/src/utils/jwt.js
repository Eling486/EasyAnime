const jwt = require('jsonwebtoken');
const fs = require('fs')
const path = require('path')

const jswUtils = {
    signToken: (payload) => {
        privateKey = fs.readFileSync(path.resolve('../keys/private.pem'))
        let token = jwt.sign(payload, {
            key: privateKey,
            passphrase: 'EasyAnime'
        }, { algorithm: 'RS256' });
        return Buffer.from(token, 'utf-8').toString('base64');
    },
    verifyToken: (tokenBase64) => {
        return new Promise((resolve, reject) => {
            publicKey = fs.readFileSync(path.resolve('../keys/public.pem'))
            let token = Buffer.from(tokenBase64, 'base64').toString('utf-8');
            jwt.verify(token, publicKey, (err, payload) => {
                if (err) {
                    return resolve(null)
                }
                return resolve(payload)
            });
        })

    },
}

module.exports = jswUtils;