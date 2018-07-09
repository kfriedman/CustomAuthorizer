/* eslint-disable semi */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.should()
chai.use(chaiAsPromised)

describe('Logger', () => {
  it('should return a Winston logger', () => {
    let Logger = require('../../lib/helpers/Logger')

    return Logger.should.be.an('object')
  })
})
