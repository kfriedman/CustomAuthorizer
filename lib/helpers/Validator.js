const Errors = require('../config/Errors')

const Logger = require('./Logger')

/**
 * @param {GatewayRequest} request
 * @param {} Config
 * @return {Promise}
 */
function validateIssuer (request, Config) {
  return new Promise((resolve, reject) => {
    if (Config.checkIssuer !== 'true') {
      return resolve(request)
    }

    if (!Config.requiredIssuer) return reject(new Errors.RequiredIssuerValidatorError(`No required issuer was specified`))

    let issuer = ''

    try {
      issuer = request.decodedToken['iss']
    } catch (error) {
      return reject(new Errors.NoIssuerValidatorError(`No issuer found in token`))
    }

    if (issuer === Config.requiredIssuer) {
      return resolve(request)
    }

    reject(new Errors.InvalidIssuerValidatorError(`Required issuer (${Config.requiredIssuer}) does not match issuer (${issuer})`))
  })
}

/**
 * @param {GatewayRequest} request
 * @param {} Config
 * @return {Promise}
 */
function validateScopes (request, Config) {
  return new Promise((resolve, reject) => {
    if (Config.checkScopes !== 'true') {
      return resolve(request)
    }

    if (!request.getRequiredScopes().length) {
      return resolve(request)
    }

    if (!request.getScopes().length) {
      return reject(new Errors.NoTokenScopesValidatorError(`No scopes found in token`))
    }

    if (request.getScopes().indexOf(Config.adminScope) !== -1) {
      return resolve(request)
    }

    Logger.info(`Requiring scopes (${request.getRequiredScopes()}) for route (${request.getMethod().toUpperCase()} ${request.getPath()})`)

    let scopeSetValid = request.getRequiredScopes().every(requiredScope => {
      return request.getScopes().indexOf(requiredScope) !== -1
    })

    if (!scopeSetValid) return reject(new Errors.InvalidScopeValidatorError(`Required scope set (${request.getRequiredScopes()}) was not found in token scope (${request.getScopes()})`))

    return resolve(request)
  })
}

module.exports = { validateIssuer, validateScopes }
