'use strict'
const fetch = require('node-fetch')
const buildUrl = require('build-url')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLFloat
} = require('graphql')

// GraphQL custom type for a Beer
const BeerType = new GraphQLObjectType({
  name: 'Beer',
  fields: () => ({
    id: { type: GraphQLID },
    name: {
      type: GraphQLString
    },
    description: { type: GraphQLString },
    abv: { type: GraphQLFloat },
    availability: {
      type: GraphQLString,
      resolve: data => data.available.name
    },
    style: {
      type: GraphQLString,
      resolve: data => data.style.name
    }
  })
})

// Helper function to build the API endpoint string
const apiEndpoint = (path) => {
  return buildUrl(
    process.env.BREWERYDB_API_ENDPOINT,
    {
      path: path,
      queryParams: {
        key: process.env.BREWERYDB_API_KEY
      }
    }
  )
}

// Query configuration for getting a specific beer with an ID
const beerQuery = {
  type: BeerType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: (root, args) =>
    fetch(apiEndpoint(`/beer/${args.id}`))
    .then(res => res.json())
    .then(json => json.data)
}

// Exported GraphQL schema
module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      beer: beerQuery
    })
  })
})
