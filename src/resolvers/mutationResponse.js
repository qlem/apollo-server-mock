'use strict'

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
