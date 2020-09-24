'use strict'

const { Query } = require('./query')
const { Mutation, InsertMutationResponse } = require('./mutation')

exports.resolvers = {
    Query,
    Mutation,
    InsertMutationResponse
}
