'use strict'
require('dotenv').load()
const serverless = require('serverless-http')
const express = require('express')
const app = express()
const graphqlHTPP = require('express-graphql')
const schema = require('./schema')

app.use('/', graphqlHTPP({
  schema,
  graphiql: true
}))

module.exports.handler = serverless(app)
