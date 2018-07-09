/* eslint-disable semi */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const MockEvent = require('../mock_event.json')
const GatewayRequest = require('../../lib/models/GatewayRequest')

chai.should()
chai.use(chaiAsPromised)

describe('GatewayRequest', () => {
  it('should return a proper resource', () => {
    let request = new GatewayRequest(MockEvent)

    request.getResource().should.equal(`arn:aws:execute-api:us-east-1:224280085904:1fg5jou30a/*`)
  })

  it('should return a proper path', () => {
    let request = new GatewayRequest(MockEvent)

    request.getPath()

    request.getPath().should.equal(`/v0.1/bibs/{nyplSource}/{id}`)
  })

  it('should return a proper method', () => {
    let request = new GatewayRequest(MockEvent)

    request.getMethod()

    request.getMethod().should.equal(`get`)
  })

  it('should return proper scopes if they exist', () => {
    let request = new GatewayRequest(MockEvent)

    let scopes = `scope1 scope2`;

    request.setDecodedToken({
      'scope': scopes
    })

    request.getScopes().should.deep.equal(scopes.split(' '))
  })

  it('should return a blank array of scopes if none exist', () => {
    let request = new GatewayRequest(MockEvent)

    request.setDecodedToken({})

    request.getScopes().should.deep.equal([])
  })

  it('should return a blank array of scopes if none exist', () => {
    let request = new GatewayRequest(MockEvent)

    request.setDecodedToken({})

    request.getScopes().should.deep.equal([])
  })

  it('should return an array of required scopes (scope with space)', () => {
    let testEvent = MockEvent

    testEvent.requestContext.resourcePath = '/api/v0.1/bibs/{nyplSource}/{id}'

    let request = new GatewayRequest(testEvent)

    request.setApiDocs(require('./../mock_docs.json'))

    request.getRequiredScopes().should.deep.equal([ 'openid', 'read:bib', 'test:scope' ])
  })

  it('should return an array of required scopes', () => {
    let testEvent = MockEvent

    testEvent.requestContext.resourcePath = '/api/v0.1/bibs'

    let request = new GatewayRequest(testEvent)

    request.setApiDocs(require('./../mock_docs.json'))

    request.getRequiredScopes().should.deep.equal([ 'openid', 'read:bib' ])
  })

  it('should return an JSON principal ID', () => {
    let request = new GatewayRequest(MockEvent)

    request.generatePrincipalId().should.be.a('string')
  })

  it('should return the docs for the route', () => {
    let request = new GatewayRequest(MockEvent)

    let routeApiDocs = 'route_api_docs'

    request.apiDocs = {
      paths: {
        '/api/v0.1/bibs': {
          get: routeApiDocs
        }
      }
    }

    request.path = '/api/v0.1/bibs'
    request.method = 'get'

    request.getRouteApiDocs()

    request.getRouteApiDocs().should.deep.equal(routeApiDocs)
  })
})
