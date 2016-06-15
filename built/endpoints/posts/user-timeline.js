"use strict";
const db_1 = require('../../db/db');
const serialize_posts_1 = require('../../core/serialize-posts');
function default_1(user, targetUserId, types = null, limit = 10, sinceId = null, maxId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 100) {
        return Promise.reject('100 made');
    }
    return new Promise((resolve, reject) => {
        let query = { user: targetUserId };
        let sort = { createdAt: -1 };
        if (sinceId !== null) {
            query.cursor = { $gt: sinceId };
            sort = { createdAt: 1 };
        }
        else if (maxId !== null) {
            query.cursor = { $lt: maxId };
        }
        if (types !== null) {
            const typesArray = types
                .split(',')
                .map(type => type.trim())
                .filter(type => type !== '');
            query.type = { $in: typesArray };
        }
        db_1.Post
            .find(query)
            .sort(sort)
            .limit(limit)
            .exec((err, timeline) => {
            if (err !== null) {
                return reject(err);
            }
            serialize_posts_1.default(timeline, user).then(serializedTimeline => {
                resolve(serializedTimeline);
            }, (serializeErr) => {
                reject(serializeErr);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
