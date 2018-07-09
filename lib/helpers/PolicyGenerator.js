/**
 * @param {GatewayRequest} request
 * @return {{}}
 */
function generateSuccessResponse (request) {
  let successResponse = {}

  successResponse.principalId = request.generatePrincipalId()

  let policyDocument = {}
  policyDocument.Version = '2012-10-17'
  policyDocument.Statement = []

  let statementOne = {}
  statementOne.Action = 'execute-api:Invoke'
  statementOne.Effect = 'Allow'
  statementOne.Resource = request.getResource()
  policyDocument.Statement[0] = statementOne
  successResponse.policyDocument = policyDocument

  return successResponse
}

module.exports = { generateSuccessResponse }
