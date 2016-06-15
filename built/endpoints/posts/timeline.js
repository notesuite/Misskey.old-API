"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../db/db');
const serialize_posts_1 = require('../../core/serialize-posts');
const read_post_1 = require('../../core/read-post');
function default_1(user, limit = 10, sinceId = null, maxId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 100) {
        return Promise.reject('100 made');
    }
    return new Promise((resolve, reject) => {
        db_1.UserFollowing.find({ follower: user.id }, (followingFindErr, following) => {
            if (followingFindErr !== null) {
                return reject(followingFindErr);
            }
            const followingIds = !isEmpty(following)
                ? [...following.map(follow => follow.followee.toString()), user.id]
                : [user.id];
            let sort = { createdAt: -1 };
            const query = Object.assign({
                user: { $in: followingIds }
            }, new powerful_1.Match(null)
                .when(() => sinceId !== null, () => {
                sort = { createdAt: 1 };
                return { _id: { $gt: sinceId } };
            })
                .when(() => maxId !== null, () => {
                return { _id: { $lt: maxId } };
            })
                .getValue({}));
            db_1.Post
                .find(query)
                .sort(sort)
                .limit(limit)
                .exec((err, timeline) => {
                if (err !== null) {
                    return reject(err);
                }
                else if (isEmpty(timeline)) {
                    return resolve([]);
                }
                serialize_posts_1.default(timeline, user).then(serializedTimeline => {
                    resolve(serializedTimeline);
                }, (serializeErr) => {
                    reject(serializeErr);
                });
                timeline.forEach(post => {
                    read_post_1.default(user, post);
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
