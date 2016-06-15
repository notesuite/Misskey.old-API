"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../../db/db');
const serialize_posts_1 = require('../../../core/serialize-posts');
function default_1(user, limit = 10, sinceId = null, maxId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 30) {
        return Promise.reject('30 made');
    }
    const query = Object.assign({
        user: user.id
    }, new powerful_1.Match(null)
        .when(() => sinceId !== null, () => {
        return { _id: { $gt: sinceId } };
    })
        .when(() => maxId !== null, () => {
        return { _id: { $lt: maxId } };
    })
        .getValue({}));
    return new Promise((resolve, reject) => {
        db_1.PostMention.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('post')
            .exec((err, mentions) => {
            if (err !== null) {
                return reject(err);
            }
            const posts = mentions.map(mention => mention.post);
            serialize_posts_1.default(posts, user).then(serializedTimeline => {
                resolve(serializedTimeline);
            }, (serializeErr) => {
                reject(serializeErr);
            });
            mentions.forEach(mention => {
                mention.isRead = true;
                mention.save();
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
