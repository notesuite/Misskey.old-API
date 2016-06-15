"use strict";
const db_1 = require('../db/db');
function serializePost(post, me = null, includeReply = true) {
    const postObj = post.toObject();
    return new Promise((resolve, reject) => {
        db_1.User.findById(post.user, (findUserErr, user) => {
            if (findUserErr !== null) {
                return reject(findUserErr);
            }
            postObj.user = user.toObject();
            switch (post.type) {
                case 'status':
                    serializeStatus(resolve, reject, postObj, me);
                    break;
                case 'reply':
                    serializeReply(resolve, reject, postObj, me, includeReply);
                    break;
                case 'repost':
                    serializeRepost(resolve, reject, postObj, me);
                    break;
                default:
                    reject('unknown-post-type');
                    break;
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = serializePost;
function serializeStatus(resolve, reject, post, me = null) {
    common(post, me).then(postObj => {
        if (postObj.files === null) {
            return resolve(postObj);
        }
        Promise.all(postObj.files.map((fileId) => new Promise((resolve2, reject2) => {
            db_1.AlbumFile.findById(fileId, (findErr, file) => {
                if (findErr !== null) {
                    reject2(findErr);
                }
                else {
                    resolve2(file.toObject());
                }
            });
        })))
            .then(files => {
            postObj.files = files;
            resolve(postObj);
        }, (getFilesErr) => {
            reject(getFilesErr);
        });
    }, (serializeErr) => {
        reject(serializeErr);
    });
}
function serializeReply(resolve, reject, post, me = null, includeReply = true) {
    common(post, me).then(postObj => {
        if (includeReply) {
            db_1.Post.findById(postObj.inReplyToPost, (findReplyErr, inReplyToPost) => {
                if (findReplyErr !== null) {
                    return reject(findReplyErr);
                }
                serializePost(inReplyToPost, me, false).then(serializedReply => {
                    kyoppie(serializedReply);
                }, (serializedReplyErr) => {
                    reject(serializedReplyErr);
                });
            });
        }
        else {
            kyoppie(postObj.inReplyToPost);
        }
        function kyoppie(inReplyToPost) {
            postObj.inReplyToPost = inReplyToPost;
            if (postObj.files === null) {
                return resolve(postObj);
            }
            Promise.all(postObj.files.map((fileId) => new Promise((resolve2, reject2) => {
                db_1.AlbumFile.findById(fileId, (findErr, file) => {
                    if (findErr !== null) {
                        reject2(findErr);
                    }
                    else {
                        resolve2(file.toObject());
                    }
                });
            })))
                .then(files => {
                postObj.files = files;
                resolve(postObj);
            }, (getFilesErr) => {
                reject(getFilesErr);
            });
        }
    }, (serializeErr) => {
        reject(serializeErr);
    });
}
function serializeRepost(resolve, reject, post, me = null) {
    db_1.Post.findById(post.post, (findTargetErr, target) => {
        if (findTargetErr !== null) {
            return reject(findTargetErr);
        }
        serializePost(target, me).then(serializedTarget => {
            post.post = serializedTarget;
            resolve(post);
        }, (err) => {
            reject(err);
        });
    });
}
function common(post, me = null) {
    return new Promise((resolve, reject) => {
        Promise.all([
            new Promise((getIsLikedResolve, getIsLikedReject) => {
                if (me === null) {
                    return getIsLikedResolve(null);
                }
                db_1.PostLike.find({
                    post: post.id,
                    user: me.id
                }).limit(1).count((countErr, count) => {
                    if (countErr !== null) {
                        return getIsLikedReject(countErr);
                    }
                    getIsLikedResolve(count > 0);
                });
            }),
            new Promise((getIsRepostedResolve, getIsRepostedReject) => {
                if (me === null) {
                    return getIsRepostedResolve(null);
                }
                db_1.Repost.find({
                    type: 'repost',
                    post: post.id,
                    user: me.id
                }).limit(1).count((countErr, count) => {
                    if (countErr !== null) {
                        return getIsRepostedReject(countErr);
                    }
                    getIsRepostedResolve(count > 0);
                });
            })
        ]).then(([isLiked, isReposted]) => {
            const serialized = post;
            serialized.isLiked = isLiked;
            serialized.isReposted = isReposted;
            resolve(serialized);
        }, (serializedErr) => {
            reject(serializedErr);
        });
    });
}
