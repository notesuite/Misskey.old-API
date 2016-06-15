"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../../../db/db');
function default_1(user) {
    return new Promise((resolve, reject) => {
        db_1.UserFollowing.find({ follower: user.id }, (followingFindErr, following) => {
            if (followingFindErr !== null) {
                return reject(followingFindErr);
            }
            else if (isEmpty(following)) {
                return resolve(0);
            }
            const followingIds = following.map(follow => follow.followee.toString());
            const query = {
                user: { $in: followingIds },
                _id: { $gt: user.timelineReadCursor }
            };
            db_1.Post
                .find(query)
                .limit(100)
                .count((err, count) => {
                if (err !== null) {
                    return reject(err);
                }
                resolve(count);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
