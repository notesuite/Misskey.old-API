"use strict";
const db_1 = require('../../db/db');
const serialize_post_1 = require('../../core/serialize-post');
const read_post_1 = require('../../core/read-post');
function default_1(shower, postId) {
    return new Promise((resolve, reject) => {
        if (postId === undefined || postId === null || postId === '') {
            return reject('post-id-required');
        }
        db_1.Post.findById(postId, (findErr, post) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (post === null) {
                return reject('not-found');
            }
            serialize_post_1.default(post, shower).then(serializedPost => {
                resolve(serializedPost);
            }, (err) => {
                reject(err);
            });
            if (shower !== null) {
                read_post_1.default(shower, post);
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
