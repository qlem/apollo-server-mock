'use strict'

const { gql } = require('apollo-server-koa')

exports.typeDefs = gql`
    type Book {
        id: ID!
        title: String
        author: Author
    }

    type Author {
        id: ID!
        name: String
    }

    type Query {
        books: [Book]!
        book(id: ID): Book
        authors: [Author]!
        author(id: ID): Author
    }

    type Mutation {
        addBook(book: BookInput): InsertBookMutationResponse
        addAuthor(author: AuthorInput): InsertAuthorMutationResponse
    }

    input BookInput {
        title: String!
        authorID: ID!
    }

    input AuthorInput {
        name: String!
    }

    interface InsertMutationResponse {
        success: Boolean!
        insertedCount: Int!
    }

    type InsertBookMutationResponse implements InsertMutationResponse {
        success: Boolean!
        insertedCount: Int!
        book: Book 
    }

    type InsertAuthorMutationResponse implements InsertMutationResponse {
        success: Boolean!
        insertedCount: Int!
        author: Author 
    }
`
