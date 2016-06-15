"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../../db/db');
const serialize_user_1 = require('../../../core/serialize-user');
function default_1(user, postId, limit = 10, sinceId = null, maxId = null) {
    return new Promise((resolve, reject) => {
        const query = Object.assign({
            post: postId
        }, new powerful_1.Match(null)
            .when(() => sinceId !== null, () => {
            return { _id: { $gt: sinceId } };
        })
            .when(() => maxId !== null, () => {
            return { _id: { $lt: maxId } };
        })
            .getValue({}));
        db_1.PostLike
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('user')
            .exec((err, likes) => {
            if (err !== null) {
                return reject(err);
            }
            else if (likes.length === 0) {
                return resolve([]);
            }
            Promise.all(likes.map(like => new Promise((resolve2, reject2) => {
                const likeObj = like.toObject();
                serialize_user_1.default(user, like.user).then(userObj => {
                    likeObj.user = userObj;
                    resolve2(likeObj);
                }, reject2);
            }))).then(resolve, reject);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
