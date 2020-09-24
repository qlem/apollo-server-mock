'use strict'

const Koa = require('koa')
const { MongoClient } = require('mongodb')
const { ApolloServer } = require('apollo-server-koa')
const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers/index')
const { logger } = require('./middleware/logger')

// mongodb stuff
const uri = 'mongodb://root:tsi966YGU@localhost:27017'
const client = new MongoClient(uri, {
    useUnifiedTopology: true
})

const connect = async () => {
    try {
        await client.connect()
        app.context.db = client.db('library')   
    } catch (err) {
        console.log(err)
        throw {
            message: 'Cannot connect to database!'
        }
    }
}

// init Koa app
const app = new Koa()
// app.use(logger)

// init Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ ctx }) => ctx
})
server.applyMiddleware({ app })

// start server
const port = 3000
app.listen(port, async () => {
    try {
        await connect()
        console.log(`Server listening at http://localhost:${port}${server.graphqlPath}`) 
    } catch (err) {
        console.log(err)
    }
})
