"use strict";
const db_1 = require('../../../db/db');
const serialize_posts_1 = require('../../../core/serialize-posts');
function default_1(user, postId, limit = 30) {
    return new Promise((resolve, reject) => {
        if (postId === undefined || postId === null || postId === '') {
            return reject('post-id-required');
        }
        db_1.Reply.findById(postId, (findErr, source) => {
            if (findErr !== null) {
                reject(findErr);
            }
            else if (source === null) {
                reject('not-found');
            }
            else if (source.type !== 'reply') {
                resolve([]);
            }
            else {
                get(source.inReplyToPost).then(posts => {
                    serialize_posts_1.default(posts, user).then(serializedTimeline => {
                        resolve(serializedTimeline);
                    }, (serializeErr) => {
                        reject(serializeErr);
                    });
                }, (err) => {
                    reject(err);
                });
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function get(id) {
    return new Promise((resolve, reject) => {
        db_1.Post.findById(id, (err, post) => {
            if (err !== null) {
                reject(err);
            }
            else if (post._doc.type !== 'reply') {
                resolve([post]);
            }
            else {
                get(post._doc.inReplyToPost).then(nextPosts => {
                    resolve([...nextPosts, post]);
                }, (getErr) => {
                    reject(getErr);
                });
            }
        });
    });
}
