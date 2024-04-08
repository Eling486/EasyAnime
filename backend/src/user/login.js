const { jwt } = require('../utils');
const { createHash } = require('crypto');

const Login = async (username, password) => {
    let data = await global.db.user.getByUsername(username)

    if (data.code < 0) return {
        code: data.code,
        msg: data.err
    }

    if (data.data.length == 0) return {
        code: -50104,
        msg: 'Incorrect username'
    }

    let pwdSHA256 = createHash('sha256').update(`EasyAnime${username}${password}`).digest('base64');
    if (pwdSHA256 !== data.data[0].password) return {
        code: -50104,
        msg: 'Incorrect password'
    }

    if (pwdSHA256 == data.data[0].password) {
        let admin = false
        if (data.data[0].is_admin == 1) {
            admin = true
        }
        let payload = {
            username: data.data[0].username,
            is_admin: admin,
            login_time: Date.now(),
        }
        let tokenBase64 = jwt.signToken(payload);

        return {
            code: 0,
            msg: 'ok',
            data: tokenBase64
        }
    }
}

module.exports = Login