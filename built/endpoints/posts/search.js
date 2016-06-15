"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../db/db');
const serialize_posts_1 = require('../../core/serialize-posts');
const escape_regexp_1 = require('../../core/escape-regexp');
function default_1(user, q, limit = 20, sinceId = null, maxId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 100) {
        return Promise.reject('100 made');
    }
    const query = Object.assign({
        text: new RegExp(escape_regexp_1.default(q), 'i')
    }, new powerful_1.Match(null)
        .when(() => sinceId !== null, () => {
        return { _id: { $gt: sinceId } };
    })
        .when(() => maxId !== null, () => {
        return { _id: { $lt: maxId } };
    })
        .getValue({}));
    return new Promise((resolve, reject) => {
        db_1.Post.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec((searchErr, posts) => {
            if (searchErr !== null) {
                return reject(searchErr);
            }
            else if (posts === null) {
                return resolve([]);
            }
            serialize_posts_1.default(posts, user).then(serializedPosts => {
                resolve(serializedPosts);
            }, (serializeErr) => {
                reject(serializeErr);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
