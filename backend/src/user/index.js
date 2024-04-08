const Login = require('./login')
const Validate = require('./validate')
const Update = require('./update')

const user = {
    login: Login,
    validate: Validate,
    update: Update,
    state: null,
    permit: null
}

module.exports = user