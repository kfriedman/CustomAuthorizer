/* eslint-disable semi */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const MockEvent = require('../mock_event.json')
const GatewayRequest = require('../../lib/models/GatewayRequest')

chai.should()
chai.use(chaiAsPromised)

describe('PolicyGenerator', () => {
  describe('generateSuccessResponse', () => {
    it('should have a proper principalId', () => {
      let PolicyGenerator = require('../../lib/helpers/PolicyGenerator')

      let request = new GatewayRequest(MockEvent)

      request.token = 'token'
      request.decodedToken = 'decoded_token'

      let result = PolicyGenerator.generateSuccessResponse(request)

      return result.should.have.property('principalId', request.generatePrincipalId())
    })

    it('should have a policyDocument with a version', () => {
      let PolicyGenerator = require('../../lib/helpers/PolicyGenerator')

      let request = new GatewayRequest(MockEvent)

      let result = PolicyGenerator.generateSuccessResponse(request)

      return result.should.have.property('policyDocument').to.have.property('Version')
    })

    it('should have a policyDocument with an array of statements', () => {
      let PolicyGenerator = require('../../lib/helpers/PolicyGenerator')

      let request = new GatewayRequest(MockEvent)

      let result = PolicyGenerator.generateSuccessResponse(request)

      return result.should.have.property('policyDocument').to.have.property('Statement').to.be.an('array')
    })
  })
})
