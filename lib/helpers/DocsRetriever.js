const Errors = require('../config/Errors')
const Logger = require('./Logger')

/**
 * @param {GatewayRequest} request
 * @param {} Config
 * @param {NodeCache} Cache
 * @param {axios} axios
 * @return {Promise}
 */
function setApiDocs (request, Config, Cache, axios) {
  return new Promise((resolve, reject) => {
    if (Cache.get(Config.cacheKeys.docs) !== undefined) {
      Logger.info(`Using cached API documentation`)

      let cachedApiDocs = Cache.get(Config.cacheKeys.docs)

      request.setApiDocs(cachedApiDocs)

      return resolve(request)
    }

    axios.get(Config.apiDocsUrl)
      .then(response => {
        Logger.info(`Retrieving API documentation from ${Config.apiDocsUrl}`)

        Cache.set(Config.cacheKeys.docs, response['data'])

        request.setApiDocs(response['data'])

        return resolve(request)
      })
      .catch(error => {
        return reject(new Errors.BadRequestDocsError(error))
      })
  })
}

module.exports = { setApiDocs }
