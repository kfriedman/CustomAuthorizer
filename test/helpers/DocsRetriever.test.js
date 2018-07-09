/* eslint-disable semi */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const NodeCache = require('node-cache')

const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const MockEvent = require('../mock_event.json')
const GatewayRequest = require('../../lib/models/GatewayRequest')
const Errors = require('../../lib/config/Errors')

const sinon = require('sinon')

chai.should()
chai.use(chaiAsPromised)

describe('DocsRetriever', () => {
  describe('setApiDocs', () => {
    it('should return cached API docs if they exist', () => {
      let DocsRetriever = require('../../lib/helpers/DocsRetriever')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        cacheKeys: {
          docs: 'docs'
        }
      }

      let cachedApiDocs = {
        route: 'docs'
      }

      let Cache = new NodeCache()
      let stub = sinon.stub(Cache, 'get').returns(cachedApiDocs)

      let result = DocsRetriever.setApiDocs(request, Config, Cache)

      stub.restore()

      return result.should.eventually.have.property('apiDocs').equal(cachedApiDocs)
    })

    it('should retrieve API docs if they are not cached', () => {
      let DocsRetriever = require('../../lib/helpers/DocsRetriever')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        apiDocsUrl: 'fakeURL',
        cacheKeys: {
          docs: 'docs'
        }
      }

      let retrievedApiDocs = {
        data: 'docs'
      }

      let Cache = new NodeCache()
      let stub = sinon.stub(Cache, 'get').returns(undefined)

      let mockAxios = new MockAdapter(axios)

      mockAxios.onAny().reply(200, retrievedApiDocs);

      let result = DocsRetriever.setApiDocs(request, Config, Cache, axios)

      stub.restore()

      return result.should.eventually.have.property('apiDocs').deep.equal(retrievedApiDocs)
    })

    it('should return a rejected Promise if unable to retrieve API', () => {
      let DocsRetriever = require('../../lib/helpers/DocsRetriever')

      let request = new GatewayRequest(MockEvent)

      let Config = {
        apiDocsUrl: 'fakeURL',
        cacheKeys: {
          docs: 'docs'
        }
      }

      let retrievedApiDocs = {
        data: 'docs'
      }

      let Cache = new NodeCache()
      let stub = sinon.stub(Cache, 'get').returns(undefined)

      let mockAxios = new MockAdapter(axios)

      mockAxios.onAny().reply(500, retrievedApiDocs);

      let result = DocsRetriever.setApiDocs(request, Config, Cache, axios)

      stub.restore()

      return result.should.be.rejectedWith(Errors.BadRequestDocsError)
    })
  })
})
