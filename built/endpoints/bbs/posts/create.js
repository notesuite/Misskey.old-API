"use strict";
const db_1 = require('../../../db/db');
const create_notification_1 = require('../../../core/create-notification');
function default_1(app, user, topicId, text, inReplyToPostId = null) {
    text = text.trim();
    if (text.length === 0) {
        return Promise.reject('empty-text');
    }
    if (text.length > 1000) {
        return Promise.reject('too-long-text');
    }
    return new Promise((resolve, reject) => {
        db_1.BBSTopic.findById(topicId, (topicFindErr, topic) => {
            if (topicFindErr !== null) {
                return reject(topicFindErr);
            }
            else if (topic === null) {
                return reject('topic-not-found');
            }
            if (inReplyToPostId !== null) {
                db_1.BBSPost.findById(inReplyToPostId, (err, reply) => {
                    if (err !== null) {
                        reject(err);
                    }
                    else if (reply === null) {
                        reject('reply-source-not-found');
                    }
                    else if (reply.isDeleted) {
                        reject('reply-source-not-found');
                    }
                    else if (reply.topic.toString() !== topicId) {
                        reject('reply-source-not-found');
                    }
                    else {
                        create(reply);
                    }
                });
            }
            else {
                create();
            }
            function create(reply = null) {
                db_1.BBSPost
                    .find({
                    topic: topic.id,
                })
                    .count((countErr, count) => {
                    if (countErr !== null) {
                        return reject(countErr);
                    }
                    db_1.BBSPost.create({
                        app: app !== null ? app.id : null,
                        user: user.id,
                        topic: topic.id,
                        number: count,
                        text: text,
                        inReplyToPost: reply !== null ? reply.id : null,
                    }, (createErr, post) => {
                        if (createErr !== null) {
                            return reject(createErr);
                        }
                        resolve(post.toObject());
                        if (count === 0) {
                            topic.pinnedPost = post.id;
                            topic.save();
                        }
                        if (reply !== null) {
                            reply.repliesCount++;
                            reply.save();
                        }
                        db_1.BBSWatching.find({
                            topic: topic.id
                        }, (watchersFindErr, watchs) => {
                            watchs.forEach(watch => {
                                if (user.id.toString() === watch.user.toString()) {
                                    return;
                                }
                                create_notification_1.default(null, watch.user, 'bbs-post', {
                                    topicId: topic.id,
                                    postId: post.id,
                                    userId: user.id
                                });
                            });
                        });
                    });
                });
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
