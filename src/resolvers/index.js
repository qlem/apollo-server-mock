'use strict'

const { queryBook, mutationBook } = require('./book')
const { queryAuthor, mutationAuthor } = require('./author')
const { InsertMutationResponse } = require('./mutationResponse')

exports.resolvers = {
    Query: {
        ...queryBook,
        ...queryAuthor
    },
    Mutation: {
        ...mutationBook,
        ...mutationAuthor
    },
    InsertMutationResponse
}
