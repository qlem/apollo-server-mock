'use strict'

const { ObjectID } = require('mongodb')

exports.Query = {
    book: async (_, args, context) => {
        try {
            const collection = context.db.collection('book')
            const res = await collection.aggregate([
                {
                    $match: {_id: ObjectID(args.id)} 
                },
                {
                    $lookup: {
                        from: 'author',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        title: 1,
                        author: {
                            id: '$author._id',
                            name: '$author.name'
                        }
                    }
                }
            ]).toArray()
            return res[0]
        } catch (err) {
            console.error(err)
        }
    },
    books: async (_, __, context) => {
        try {
            const collection = context.db.collection('book')
            const docs = await collection.aggregate([
                {
                    $lookup: {
                        from: 'author',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        title: 1,
                        author: {
                            id: '$author._id',
                            name: '$author.name'
                        }
                    }
                }, 
                {
                    $sort: {title: 1}
                }
            ]).toArray()
            return docs
        } catch (err) {
            console.error(err)
        }
    },
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
