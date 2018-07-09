Custom Authorizer for NYPL API Gateway
======================================

[![Coverage Status](https://coveralls.io/repos/github/NYPL/nypl-authorizer/badge.svg?branch=master)](https://coveralls.io/github/NYPL/nypl-authorizer?branch=master)

An AWS Lambda written in Node JS to act as a [custom authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html) for the NYPL API Gateway on Amazon Web Services (AWS).

## Table of Contents
- [Requirements](#requirements)
- Getting Started
  - [Installation](#installation)
  - [Setup Configurations](#setup-configurations)
  - [Developing Locally](#developing-locally)
  - [Deploying your Lambda](#deploying-your-lambda)
  - [Tests](#tests)
  - [Linting](#linting)
- [Dependencies](#npm-dependencies)

## Version
> v1.0

## Requirements
> [Node 6.10.0](https://nodejs.org/docs/v6.1.0/api/)

## Getting Started

### Installation

Install all Node dependencies via NPM
```console
$ npm install
```

### Setup Configurations

Once all dependencies are installed, you want to run the following NPM commands included in the `package.json` configuration file to setup a local development environment.

#### Step 1: Create an `.env` file for the `node-lambda` module
> Copies the sample .env file under ./sample/.env.sample into ./.env

```console
$ npm run setup-node-lambda-env
```

#### Step 2: Add your AWS environment variables
Once the `.env` file is copied, open the file and edit the following:
```console
AWS_ENVIRONMENT=development
AWS_ACCESS_KEY_ID=<YOUR KEY ID>
AWS_SECRET_ACCESS_KEY=<YOUR SECRET ACCESS KEY>
AWS_PROFILE=
AWS_SESSION_TOKEN=
AWS_ROLE_ARN=<ROLE OBTAINED FROM AWS CONSOLE>
AWS_REGION=us-east-1
AWS_FUNCTION_NAME=<FUNCTION NAME> (OPTIONAL)
AWS_HANDLER=index.handler
AWS_MEMORY_SIZE=128
AWS_TIMEOUT=3
AWS_DESCRIPTION=
AWS_RUNTIME=nodejs6.10
AWS_VPC_SUBNETS=
AWS_VPC_SECURITY_GROUPS=
AWS_TRACING_CONFIG=
EXCLUDE_GLOBS="event.json"
PACKAGE_DIRECTORY=build
```

#### Step 3: Setup your environment specific `{environment}.env` file

Running the following NPM Commands will:

* Set up your **LOCAL** `.env` file as `./config/local.env` used for local development

```console
$ npm run setup-local-env
```

* Set up your **DEVELOPMENT** `.env` file as `./config/development.env`
```console
$ npm run setup-development-env
```

* Set up your **PRODUCTION** `.env` file as `./config/production.env`
```console
$ npm run setup-production-env
```

These environment specific `.env` files will be used to set **environment variables** when deployed by the `node-lambda` module.

An example of the sample deployment environment `.env` file:
```console
MATCH_ISSUER=true                                        // Require that a token's issuer (`iss`) on a request match
REQUIRED_ISSUER=isso.nypl.org                            // If matching an issuer, the request's issuer must match this value
APIDOCS_URL=https://platformdocs.nypl.org/api/v0.1.json  // Full URL to API documentation
DEBUG_TOKEN=eyJ0eX...                                    // A token to use when debugging locally
NODE_ENV=XXX                                             // Use `local` when developing locally via `npm run local-run`. If deploying to AWS via `npm run deploy-ENV` use `production`, this will trigger the decryption client for encrypted ENV variables.
```

#### Step 4: Setup your environment specific `event_sources_{environment}.json` file
This file is used by the `node-lambda` module to deploy your Lambda with the correct mappings.

You **must** edit the file once created and add your specific **EventSourceArn** value, found in the AWS Console. If no mapping is necessary, update the file to an empty object `{}`.

Running the following NPM Commands will:

* Set up your **DEVELOPMENT** `event_sources_development.json` file in `./config/`
```console
$ npm run setup-development-sources
```

* Set up your **PRODUCTION** `event_sources_production.json` file in `./config/`
```console
$ npm run setup-production-sources
```
### Developing Locally
To develop and run your Lambda locally you must ensure to complete `Step 1` and `Step 2` of the Setup process.

***REMINDER:*** Your `./config/local.env` and `./.env` environment variables ***MUST*** be configured in order for the next step to work.

Next, run the following NPM command to use the **sample** events found in `./sample/events`.

> Exceutes `node lambda run` pointing the the sample event.
```console
$ npm run bib
```

### Deploying your Lambda
To deploy your Lambda function via the `node-lambda` module __**ensure**__ you have completed all the steps of the [Setup](#setup-configurations) process and have added all configuration variables required.

The following NPM Commands will execute the `node-lambda deploy` command mapping configurations to the proper environments (qa & production). These commands can be modified in `package.json`.

* Runs `node-lambda deploy` with **DEVELOPMENT** configurations
```console
$ npm run deploy-development
```

* Runs `node-lambda deploy` with **PRODUCTION** configurations
```console
$ npm run deploy-production
```

### Tests
#### Test Coverage
[Istanbul](https://github.com/istanbuljs/nyc) is currently used in conjunction with Mocha to report coverage of all unit tests.

Simply run:
```javascript
$ npm run coverage-report
```

Executing this NPM command will create a `./coverage/` folder with an interactive UI reporting the coverage analysis, now you can open up `./coverage/index.html` in your browser to view an enhanced report.

#### Running Unit Tests
Unit tests are written using [Mocha](https://github.com/mochajs/mocha), [Chai](https://github.com/chaijs) and [Sinon](https://github.com/domenic/sinon-chai). All tests can be found under the `./test` directory. Mocha configurations are set and can be modified in `./test/mocha.opts`.

> To run test, use the following NPM script found in `package.json`.

```javascript
$ npm run test // Will run all tests found in the ./test/ path
```

```javascript
$ npm run test [filename].test.js // Will run a specific test for the given filename
```
### Linting
This codebase currently uses [Standard JS](https://www.npmjs.com/package/standard) as the JavaScript linter.

To lint files use the following NPM command:
```javascript
$ npm run lint // Will lint all files except those listed in package.json under standard->ignore
```

```javascript
$ npm run lint [filename].js // Will lint the specific JS file
```
