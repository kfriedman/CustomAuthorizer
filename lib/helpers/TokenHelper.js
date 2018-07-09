const Errors = require('../config/Errors')

const fs = require('fs')

/**
 * @param {GatewayRequest} request
 * @param {} Config
 * @return {Promise}
 */
function setToken (request, Config) {
  return new Promise((resolve, reject) => {
    if (Config.environment === `local` && Config.debugToken) {
      request.event['headers']['Authorization'] = `Bearer ${Config.debugToken}`
    }

    let authorizationHeader = ''

    try {
      authorizationHeader = request.event['headers']['Authorization']
    } catch (error) {
      return reject(new Errors.InvalidAuthorizationTokenError(`Authorization header was not found in request`))
    }

    if (!authorizationHeader) return reject(new Errors.BlankAuthorizationTokenError(`Authorization header is blank`))

    let [tokenType, token] = authorizationHeader.split(' ')

    if (tokenType !== 'Bearer') {
      return reject(new Errors.InvalidTypeTokenError(`Unauthorized: Invalid token type in Authorization header (no Bearer)`))
    }

    request.setToken(token)

    return resolve(request)
  })
}

/**
 * @param {GatewayRequest} request
 * @param {} Config
 * @param {jwt} jwt
 * @return {Promise}
 */
function setDecodedToken (request, Config, jwt) {
  return new Promise((resolve, reject) => {
    jwt.verify(request.token, fs.readFileSync(Config.publicKey), function (err, data) {
      if (err) {
        return reject(err)
      }

      request.setDecodedToken(data)

      return resolve(request)
    })
  })
}

module.exports = { setToken, setDecodedToken }
