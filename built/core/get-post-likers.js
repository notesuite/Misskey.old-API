"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../db/db');
function default_1(postId, limit = 10, sinceId = null, maxId = null) {
    return new Promise((resolve, reject) => {
        const query = new powerful_1.Match(null)
            .when(() => sinceId !== null, () => {
            return { $and: [
                    { post: postId },
                    { _id: { $gt: sinceId } }
                ] };
        })
            .when(() => maxId !== null, () => {
            return { $and: [
                    { post: postId },
                    { _id: { $lt: maxId } }
                ] };
        })
            .getValue({ post: postId });
        db_1.PostLike.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('user')
            .exec((likesFindErr, likes) => {
            if (likesFindErr !== null) {
                reject(likesFindErr);
            }
            else if (isEmpty(likes)) {
                resolve(null);
            }
            else {
                resolve(likes.map(like => like.user));
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
