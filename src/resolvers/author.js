'use strict'

const { ObjectID } = require('mongodb')

exports.queryAuthor = {
    author: async (_, args, context) => {
        try {
            const collection = context.db.collection('author')
            const res = await collection.findOne({_id: ObjectID(args.id)})
            return {
                id: res._id,
                name: res.name
            }
        } catch (err) {
            console.error(err)
        }
    },
    authors: async (_, __, context) => {
        try {
            const collection = context.db.collection('author')
            const res = await collection.find({}, {
                sort: {name: 1}
            }).toArray()
            return res.map(author => ({
                id: author._id,
                name: author.name
            }))
        } catch (err) {
            console.error(err)
        }
    }
}

exports.mutationAuthor = {
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
