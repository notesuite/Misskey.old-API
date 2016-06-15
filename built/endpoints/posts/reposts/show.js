"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../../db/db');
const serialize_posts_1 = require('../../../core/serialize-posts');
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
        db_1.Repost
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec((err, reposts) => {
            if (err !== null) {
                return reject(err);
            }
            else if (reposts.length === 0) {
                return resolve([]);
            }
            serialize_posts_1.default(reposts, user).then(serializedReposts => {
                resolve(serializedReposts);
            }, (serializeErr) => {
                reject(serializeErr);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
