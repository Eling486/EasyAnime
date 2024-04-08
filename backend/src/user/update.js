const { jwt } = require('../utils');
const { createHash } = require('crypto');

const Update = async (username, password, admin = false) => {
    let pwdSHA256 = createHash('sha256').update(`EasyAnime${username}${password}`).digest('base64');
    if (admin) {
        let resUpdate = await global.db.user.updateByUid(1, username, pwdSHA256)
        if (resUpdate < 0) {
            return {
                code: -500,
                msg: 'Server Error'
            }
        }
        return {
            code: 0,
            msg: 'ok',
        }
    }
    return {
        code: 0,
        msg: 'ok',
    }
}

module.exports = Update