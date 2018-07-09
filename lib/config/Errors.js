class MissingParameter extends Error {}

class NoDocumentationRequestError extends Error {}

class InvalidAuthorizationTokenError extends Error {}
class BlankAuthorizationTokenError extends Error {}
class InvalidTypeTokenError extends Error {}

class BlankTokenError extends Error {}
class InvalidKeyTokenError extends Error {}

class RequiredIssuerValidatorError extends Error {}
class NoIssuerValidatorError extends Error {}
class InvalidIssuerValidatorError extends Error {}
class NoTokenScopesValidatorError extends Error {}
class InvalidScopeValidatorError extends Error {}

class BadRequestDocsError extends Error {}

module.exports = {
  MissingParameter,
  NoDocumentationRequestError,
  InvalidAuthorizationTokenError,
  BlankAuthorizationTokenError,
  InvalidTypeTokenError,
  BlankTokenError,
  InvalidKeyTokenError,
  RequiredIssuerValidatorError,
  NoIssuerValidatorError,
  InvalidIssuerValidatorError,
  NoTokenScopesValidatorError,
  InvalidScopeValidatorError,
  BadRequestDocsError
}
