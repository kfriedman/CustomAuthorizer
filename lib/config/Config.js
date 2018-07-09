const path = require('path')

module.exports = {
  environment: process.env['NODE_ENV'],
  debugToken: process.env['DEBUG_TOKEN'],
  apiDocsUrl: process.env['APIDOCS_URL'],
  checkIssuer: process.env['CHECK_ISSUER'],
  checkScopes: process.env['CHECK_SCOPES'],
  requiredIssuer: process.env['REQUIRED_ISSUER'],
  publicKey: path.join(__dirname, '/cert.pem'),
  adminScope: 'admin',
  cacheKeys: {
    docs: 'docs-cache'
  },
  cacheDefaultTtl: 600
}
