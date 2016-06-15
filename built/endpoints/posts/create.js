"use strict";
const db_1 = require('../../db/db');
const serialize_post_1 = require('../../core/serialize-post');
const save_post_mentions_1 = require('../../core/save-post-mentions');
const extract_hashtags_1 = require('../../core/extract-hashtags');
const register_hashtags_1 = require('../../core/register-hashtags');
const get_album_file_1 = require('../../core/get-album-file');
const event_1 = require('../../event');
function default_1(app, user, text, filesString) {
    const maxTextLength = 300;
    const maxFileLength = 4;
    return new Promise((resolve, reject) => {
        if (user === undefined || user === null) {
            return reject('plz-authenticate');
        }
        else if (user.isSuspended) {
            return reject('access-denied');
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
                latestPost._doc.type === 'status' &&
                latestPost._doc.text !== null &&
                text !== null &&
                text === latestPost._doc.text) {
                return reject('content-duplicate');
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
            function create(files) {
                const hashtags = extract_hashtags_1.default(text);
                db_1.Status.create({
                    app: app !== null ? app.id : null,
                    user: user.id,
                    files: files !== null ? files.map(file => file.id) : null,
                    text: text,
                    hashtags: hashtags,
                    prevPost: latestPost !== null ? latestPost.id : null,
                    nextPost: null
                }, (createErr, createdStatus) => {
                    if (createErr !== null) {
                        return reject(createErr);
                    }
                    user.postsCount++;
                    user.latestPost = createdStatus.id;
                    user.save((saveErr, user2) => {
                        if (saveErr !== null) {
                            return reject(saveErr);
                        }
                        serialize_post_1.default(createdStatus, user2).then(serialized => {
                            resolve(serialized);
                        }, (serializeErr) => {
                            reject(serializeErr);
                        });
                    });
                    register_hashtags_1.default(user, hashtags);
                    save_post_mentions_1.default(user, createdStatus, createdStatus.text);
                    if (latestPost !== null) {
                        latestPost.nextPost = createdStatus.id;
                        latestPost.save();
                    }
                    event_1.default.publishPost(user.id, createdStatus);
                });
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
