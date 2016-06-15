"use strict";
const db_1 = require('../../db/db');
const serialize_post_1 = require('../../core/serialize-post');
const save_post_mentions_1 = require('../../core/save-post-mentions');
const extract_hashtags_1 = require('../../core/extract-hashtags');
const register_hashtags_1 = require('../../core/register-hashtags');
const get_album_file_1 = require('../../core/get-album-file');
const event_1 = require('../../event');
function default_1(app, user, inReplyToPostId, text, filesString) {
    const maxTextLength = 300;
    const maxFileLength = 4;
    return new Promise((resolve, reject) => {
        if (user === undefined || user === null) {
            return reject('plz-authenticate');
        }
        else if (user.isSuspended) {
            return reject('access-denied');
        }
        if (inReplyToPostId === undefined || inReplyToPostId === null || inReplyToPostId === '') {
            return reject('in-reply-to-post-id-is-required');
        }
        if (text !== undefined && text !== null) {
            text = text.trim();
            if (text.length === 0) {
                text = null;
            }
            else if (text.length > maxTextLength) {
                return reject('too-long-text');
            }
        }
        else {
            text = null;
        }
        let fileIds = null;
        if (filesString !== undefined && filesString !== null) {
            fileIds = filesString
                .split(',')
                .map(fileId => fileId.trim())
                .filter(fileId => fileId !== '');
            if (fileIds.length === 0) {
                fileIds = null;
            }
            else if (fileIds.length > maxFileLength) {
                return reject('too-many-files');
            }
            if (fileIds !== null) {
                let isRejected = false;
                fileIds.forEach(fileId => {
                    let count = 0;
                    fileIds.forEach(fileId2 => {
                        if (fileId === fileId2) {
                            count++;
                            if (count === 2) {
                                isRejected = true;
                            }
                        }
                    });
                });
                if (isRejected) {
                    return reject('duplicate-files');
                }
            }
        }
        else {
            fileIds = null;
        }
        if (text === null && fileIds === null) {
            return reject('text-or-files-is-required');
        }
        db_1.Post.findById(user.latestPost, (latestPostFindErr, latestPost) => {
            if (latestPost !== null &&
                latestPost._doc.type === 'reply' &&
                latestPost._doc.text !== null &&
                text !== null &&
                text === latestPost._doc.text &&
                inReplyToPostId === latestPost._doc.inReplyToPost.toString()) {
                return reject('content-duplicate');
            }
            db_1.Post.findById(inReplyToPostId, (err, inReplyToPost) => {
                if (err !== null) {
                    return reject(err);
                }
                else if (inReplyToPost === null) {
                    return reject('reply-target-not-found');
                }
                else if (inReplyToPost.isDeleted) {
                    return reject('reply-target-not-found');
                }
                else if (inReplyToPost.type === 'repost') {
                    return reject('reply-to-repost-is-not-allowed');
                }
                if (fileIds !== null) {
                    Promise.all(fileIds.map(fileId => get_album_file_1.default(user.id, fileId)))
                        .then(files => {
                        create(files);
                    }, (filesCheckErr) => {
                        reject(filesCheckErr);
                    });
                }
                else {
                    create(null);
                }
                function create(files = null) {
                    const hashtags = extract_hashtags_1.default(text);
                    db_1.Reply.create({
                        app: app !== null ? app.id : null,
                        user: user.id,
                        inReplyToPost: inReplyToPost.id,
                        files: files !== null ? files.map(file => file.id) : null,
                        text: text,
                        hashtags: hashtags,
                        prevPost: latestPost !== null ? latestPost.id : null,
                        nextPost: null
                    }, (createErr, createdReply) => {
                        if (createErr !== null) {
                            return reject(createErr);
                        }
                        serialize_post_1.default(createdReply, user).then(serialized => {
                            resolve(serialized);
                        }, (serializeErr) => {
                            reject(serializeErr);
                        });
                        if (latestPost !== null) {
                            latestPost.nextPost = createdReply.id;
                            latestPost.save();
                        }
                        user.postsCount++;
                        user.latestPost = createdReply.id;
                        user.save();
                        inReplyToPost.repliesCount++;
                        inReplyToPost.save();
                        register_hashtags_1.default(user, hashtags);
                        save_post_mentions_1.default(user, createdReply, createdReply.text);
                        event_1.default.publishPost(user.id, createdReply);
                    });
                }
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
