'use strict'

const { ObjectID } = require('mongodb')

exports.queryBook = {
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
    }
}

exports.mutationBook = {
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
    }  
} 
