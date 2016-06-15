"use strict";
const db_1 = require('../../db/db');
const create_notification_1 = require('../../core/create-notification');
function default_1(user, id) {
    return new Promise((resolve, reject) => {
        db_1.Post.findById(id, (err, post) => {
            if (err !== null) {
                return reject(err);
            }
            else if (post === null) {
                return reject('post-not-found');
            }
            else if (post.isDeleted) {
                return reject('post-is-deleted');
            }
            else if (post.type === 'repost') {
                return reject('no-like-to-repost');
            }
            db_1.PostLike.findOne({
                post: post.id,
                user: user.id
            }, (postLikeFindErr, postLike) => {
                if (postLikeFindErr !== null) {
                    return reject(postLikeFindErr);
                }
                if (postLike !== null) {
                    return reject('already-liked');
                }
                db_1.PostLike.create({
                    post: post.id,
                    user: user.id
                }, (createErr, createdPostLike) => {
                    if (createErr !== null) {
                        return reject(createErr);
                    }
                    resolve();
                    post.likesCount++;
                    post.save();
                    user.likesCount++;
                    user.save();
                    db_1.User.findById(post.user, (authorFindErr, author) => {
                        author.likedCount++;
                        author.save();
                    });
                    create_notification_1.default(null, post.user, 'like', {
                        postId: post.id,
                        userId: user.id
                    });
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
