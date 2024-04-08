const { jwt } = require('../utils');

const Validate = async (data) => {
    let tokenBase64

    if(typeof data == 'string'){
        tokenBase64 = data
    }
    if(typeof data == 'object'){
        tokenBase64 = data.headers['authorization']
    }
    if(!tokenBase64){
        return {
            logined: false
        }
    }
    
    let payload = await jwt.verifyToken(tokenBase64);

    let logined = false

    if(payload && payload['username']){
        logined = true
    }

    return {
        logined: logined,
        payload: payload
    }
}

module.exports = Validate