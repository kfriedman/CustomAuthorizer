/* eslint-disable semi */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const Errors = require('../../lib/config/Errors')
const MockEvent = require('../mock_event.json')
const GatewayRequest = require('../../lib/models/GatewayRequest')

chai.should()
chai.use(chaiAsPromised)

describe('Validator', () => {
  describe('validateIssuer', () => {
    it('should return resolved Promise is checkIssuer is not true', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        checkIssuer: `false`
      }

      let result = Validator.validateIssuer(request, Config)

      return result.should.be.fulfilled
    })

    it('should return a rejected Promise with an error if no required issuer is specified', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        checkIssuer: `true`
      }

      let result = Validator.validateIssuer(request, Config)

      return result.should.be.rejectedWith(Errors.RequiredIssuerValidatorError)
    })

    it('should return a rejected Promise with an error no issuer is in the token', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        checkIssuer: `true`,
        requiredIssuer: `required_issuer`
      }

      let result = Validator.validateIssuer(request, Config)

      return result.should.be.rejectedWith(Errors.NoIssuerValidatorError)
    })

    it('should return a rejected Promise with an error if required issuer does not match token', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)
      let requiredIssuer = `required_issuer`

      let Config = {
        checkIssuer: `true`,
        requiredIssuer: requiredIssuer
      }

      request.decodedToken = {
        iss: `does_not_match`
      }

      let result = Validator.validateIssuer(request, Config)

      return result.should.be.rejectedWith(Errors.InvalidIssuerValidatorError)
    })

    it('should return resolved Promise is issuer matches', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)
      let requiredIssuer = `required_issuer`

      let Config = {
        checkIssuer: `true`,
        requiredIssuer: requiredIssuer
      }

      request.decodedToken = {
        iss: requiredIssuer
      }

      let result = Validator.validateIssuer(request, Config)

      return result.should.be.fulfilled
    })
  })

  describe('validateScopes', () => {
    it('should return a resolved Promise if scope checking is disabled', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        checkScopes: 'false'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.fulfilled
    })

    it('should return a resolved Promise if no required scopes are found and route is valid', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      request.apiDocs = {
        paths: {
          '/api/v0.1/bibs': {
            get: true
          }
        }
      }

      request.path = '/api/v0.1/bibs'
      request.method = 'get'

      let Config = {
        checkScopes: 'true'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.fulfilled
    })

    it('should return a rejected Promise with an error if no scopes are found in the token', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      request.requiredScopes = [
        [`scope1`]
      ]

      let Config = {
        checkScopes: 'true'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.rejectedWith(Errors.NoTokenScopesValidatorError)
    })

    it('should return a resolved Promise if admin scope is found', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      let adminScope = `admin_scope`

      request.requiredScopes = [`scope1`]
      request.scopes = [adminScope]

      let Config = {
        checkScopes: 'true',
        adminScope: adminScope
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.fulfilled
    })

    it('should return a rejected Promise with an error if multiple scopes are required and one is not found', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      request.requiredScopes = [`scope1`, `scope2`]
      request.scopes = [`scope1`]

      let Config = {
        checkScopes: 'true'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.rejectedWith(Errors.InvalidScopeValidatorError)
    })

    it('should return a rejected Promise with an error if a single scope is required and not found', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      request.requiredScopes = [`scope1`]
      request.scopes = [`scope2`]

      let Config = {
        checkScopes: 'true'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.rejectedWith(Errors.InvalidScopeValidatorError)
    })

    it('should return a resolved Promise if required scopes are found', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      request.requiredScopes = [`scope1`, `scope2`]
      request.scopes = [`scope1`, `scope2`]

      let Config = {
        checkScopes: 'true'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.fulfilled
    })

    it('should return a resolved Promise if required scopes are found and extra scopes exist', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      request.requiredScopes = [`scope1`, `scope2`]
      request.scopes = [`scope1`, `scope2`, `scope3`]

      let Config = {
        checkScopes: 'true'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.fulfilled
    })

    it('should return a rejected Promise with an error if the route is not found', () => {
      let Validator = require('../../lib/helpers/Validator')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        checkScopes: 'true'
      }

      let result = Validator.validateScopes(request, Config)

      return result.should.be.rejectedWith(Errors.NoDocumentationRequestError)
    })
  })
})
