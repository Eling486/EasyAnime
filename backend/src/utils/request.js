const axios = require('axios')

const request = (method, url, data = null, header = {}) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: url,
      method: method,
      data: data,
      header: header
    }).then(res => {
      return resolve(res)
    }).catch(err => {
      return reject(err)
    })
  })
}

module.exports = request