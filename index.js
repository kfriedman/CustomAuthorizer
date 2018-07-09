const GatewayRequest = require('./lib/models/GatewayRequest')
const Logger = require('./lib/helpers/Logger')
const Config = require('./lib/config/Config')

const NodeCache = require('node-cache')
const Cache = new NodeCache({stdTTL: Config.cacheDefaultTtl, checkperiod: 0})
const axios = require('axios')
const jwt = require('jsonwebtoken')

const TokenHelper = require('./lib/helpers/TokenHelper')
const Validator = require('./lib/helpers/Validator')
const DocsRetriever = require('./lib/helpers/DocsRetriever')
const PolicyGenerator = require('./lib/helpers/PolicyGenerator')

/**
 * @param {Object} event
 * @param {Object} context
 * @param callback
 */
exports.handler = function jwtHandler (event, context, callback) {
  let gatewayRequest = new GatewayRequest(event)

  TokenHelper.setToken(gatewayRequest, Config)
    .then(gatewayRequest => TokenHelper.setDecodedToken(gatewayRequest, Config, jwt))
    .then(gatewayRequest => Validator.validateIssuer(gatewayRequest, Config))
    .then(gatewayRequest => DocsRetriever.setApiDocs(gatewayRequest, Config, Cache, axios))
    .then(gatewayRequest => Validator.validateScopes(gatewayRequest, Config))
    .then(gatewayRequest => {
      return callback(null, PolicyGenerator.generateSuccessResponse(gatewayRequest))
    })
    .catch(error => {
      Logger.error(error.toString(), error)

      return callback(new Error(`Unauthorized`))
    })
}
