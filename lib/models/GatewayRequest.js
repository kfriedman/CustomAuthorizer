const Errors = require('../config/Errors')

class GatewayRequest {
  constructor (event) {
    this.event = event

    this.token = undefined
    this.decodedToken = undefined
    this.apiDocs = undefined
    this.routeApiDocs = undefined
    this.path = undefined
    this.method = undefined
    this.scopes = undefined
    this.requiredScopes = undefined
  }

  setToken (token) {
    this.token = token
  }

  setDecodedToken (decodedToken) {
    this.decodedToken = decodedToken
  }

  setApiDocs (apiDocs) {
    this.apiDocs = apiDocs
  }

  setRouteApiDocs (routeApiDocs) {
    this.routeApiDocs = routeApiDocs
  }

  getResource () {
    let methodArn = this.event['methodArn'].split(':')
    let apiGatewayArn = methodArn[5].split('/')

    return methodArn[0] + ':' + methodArn[1] + ':' + methodArn[2] + ':' + methodArn[3] + ':' + methodArn[4] + ':' + apiGatewayArn[0] + '/*'
  }

  getPath () {
    if (this.path !== undefined) return this.path

    this.path = this.event['requestContext']['resourcePath'].substr(4)

    return this.path
  }

  getMethod () {
    if (this.method !== undefined) return this.method

    this.method = this.event['requestContext']['httpMethod'].toLowerCase()

    return this.method
  }

  getScopes () {
    if (this.scopes !== undefined) return this.scopes

    try {
      this.scopes = this.decodedToken['scope'].split(' ')

      return this.scopes
    } catch (error) {
      this.scopes = []

      return this.scopes
    }
  }

  getRouteApiDocs () {
    if (this.routeApiDocs !== undefined) return this.routeApiDocs

    try {
      this.setRouteApiDocs(this.apiDocs['paths'][this.getPath()][this.getMethod()])

      return this.routeApiDocs
    } catch (error) {
      throw new Errors.NoDocumentationRequestError(`No documentation found for route (${this.getMethod().toUpperCase()} ${this.getPath()})`)
    }
  }

  getRequiredScopes () {
    if (this.requiredScopes !== undefined) return this.requiredScopes

    let routeApiDocs = this.getRouteApiDocs()

    try {
      let allRequiredScopes = []

      routeApiDocs['security'][0]['api_auth'].forEach((requiredRouteScopes) => {
        allRequiredScopes = allRequiredScopes.concat(requiredRouteScopes.split(' '))
      })

      this.requiredScopes = allRequiredScopes

      return this.requiredScopes
    } catch (error) {
      this.requiredScopes = []

      return this.requiredScopes
    }
  }

  generatePrincipalId () {
    return JSON.stringify({
      token: this.token,
      identity: this.decodedToken
    })
  }
}

module.exports = GatewayRequest
