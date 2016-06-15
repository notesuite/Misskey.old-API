"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../../db/db');
const serialize_posts_1 = require('../../../core/serialize-posts');
function default_1(user, id, limit = 10, sinceId = null, maxId = null) {
    return new Promise((resolve, reject) => {
        const query = Object.assign({ inReplyToPost: id }, new powerful_1.Match(null)
            .when(() => sinceId !== null, () => { return { _id: { $gt: sinceId } }; })
            .when(() => maxId !== null, () => { return { _id: { $lt: maxId } }; })
            .getValue({}));
        db_1.Reply
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec((err, replies) => {
            if (err !== null) {
                return reject(err);
            }
            else if (replies.length === 0) {
                return resolve([]);
            }
            serialize_posts_1.default(replies, user).then(serializedTimeline => {
                resolve(serializedTimeline);
            }, (serializeErr) => {
                reject(serializeErr);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
