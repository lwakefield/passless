const crypto = require('crypto')

module.exports = function random (len) {
    return crypto.randomBytes(len).toString('base64')
}
