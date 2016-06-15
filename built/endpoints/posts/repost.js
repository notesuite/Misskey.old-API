"use strict";
const db_1 = require('../../db/db');
const serialize_post_1 = require('../../core/serialize-post');
const create_notification_1 = require('../../core/create-notification');
const event_1 = require('../../event');
function default_1(app, user, targetPostId) {
    return new Promise((resolve, reject) => {
        if (user === undefined || user === null) {
            return reject('plz-authenticate');
        }
        else if (user.isSuspended) {
            return reject('access-denied');
        }
        if (targetPostId === undefined || targetPostId === null || targetPostId === '') {
            return reject('target-post-id-is-required');
        }
        db_1.Post.findById(user.latestPost, (latestPostFindErr, latestPost) => {
            db_1.Post.findById(targetPostId, (findErr, post) => {
                if (findErr !== null) {
                    return reject(findErr);
                }
                else if (post === null) {
                    return reject('not-found');
                }
                else if (post.isDeleted) {
                    return reject('post-is-deleted');
                }
                else if (post.user.toString() === user.id.toString()) {
                    return reject('your-post');
                }
                else if (post.type === 'repost') {
                    return reject('no-rerepost');
                }
                db_1.Repost.findOne({
                    user: user.id,
                    type: 'repost',
                    post: post.id
                }, (findOldErr, oldRepost) => {
                    if (findOldErr !== null) {
                        return reject(findOldErr);
                    }
                    else if (oldRepost !== null) {
                        return reject('already-reposted');
                    }
                    db_1.Repost.create({
                        app: app !== null ? app.id : null,
                        user: user.id,
                        post: post.id,
                        prevPost: latestPost !== null ? latestPost.id : null,
                        nextPost: null
                    }, (err, createdRepost) => {
                        if (err !== null) {
                            return reject(err);
                        }
                        serialize_post_1.default(createdRepost, user).then(serialized => {
                            resolve(serialized);
                        }, (serializeErr) => {
                            reject(serializeErr);
                        });
                        if (latestPost !== null) {
                            latestPost.nextPost = createdRepost.id;
                            latestPost.save();
                        }
                        user.latestPost = createdRepost.id;
                        user.save();
                        post.repostsCount++;
                        post.save();
                        event_1.default.publishPost(user.id, createdRepost);
                        create_notification_1.default(null, post.user, 'repost', {
                            postId: post.id,
                            userId: user.id
                        });
                    });
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
