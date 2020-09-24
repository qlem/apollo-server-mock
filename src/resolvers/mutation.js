'use strict'

const { ObjectID } = require('mongodb')

exports.InsertMutationResponse = {
    __resolveType(obj, context, info) {
        if (obj.book) {
            return 'InsertBookMutationResponse'
        }
        if (obj.author) {
            return 'InsertAuthorMutationResponse'
        }
        return null
    }
}

exports.Mutation = {
    addBook: async (_, args, context) => {
        try {
            let collection = context.db.collection('author')
            let res = await collection.findOne({_id: ObjectID(args.book.authorID)})
            if (!res) {
                return {
                    success: false,
                    insertedCount: 0,
                    book: null
                }
            }
            const author = {
                id: res._id,
                name: res.name
            }
            collection = context.db.collection('book')
            res = await collection.insertOne({
                title: args.book.title,
                author: ObjectID(author.id)
            })
            if (res.result.ok === 1) {
                const book = {
                    id: res.insertedId,
                    title: args.book.title,
                    author: author 
                }
                return {
                    success: true,
                    insertedCount: res.insertedCount,
                    book: book
                }
            }
            return {
                success: false,
                insertedCount: res.insertedCount,
                book: null
            }
        } catch (err) {
            console.error(err)
        }
    },
    addAuthor: async (_, args, context) => {
        try {
            const collection = context.db.collection('author')
            const res = await collection.insertOne(args.author)
            return {
                success: res.result.ok === 1 ? true : false,
                insertedCount: res.insertedCount,
                author: res.result.ok === 1 ? {
                    id: res.insertedId,
                    name: res.ops[0].name
                } : null
            }
        } catch (err) {
            console.error(err)
        }
    }
}
