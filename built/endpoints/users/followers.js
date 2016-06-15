"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../db/db');
const serialize_user_1 = require('../../core/serialize-user');
function default_1(me, userId, limit = 30, sinceId = null, maxId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 30) {
        return Promise.reject('30 made');
    }
    return new Promise((resolve, reject) => {
        const query = Object.assign({
            followee: userId
        }, new powerful_1.Match(null)
            .when(() => sinceId !== null, () => {
            return { _id: { $gt: sinceId } };
        })
            .when(() => maxId !== null, () => {
            return { _id: { $lt: maxId } };
        })
            .getValue({}));
        db_1.UserFollowing
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('follower')
            .exec((err, userFollowing) => {
            if (err !== null) {
                return reject(err);
            }
            Promise.all(userFollowing.map(follow => {
                return serialize_user_1.default(me, follow.follower);
            })).then((followers) => {
                for (let i = 0; i < followers.length; i++) {
                    followers[i].followingId = userFollowing[i]._id;
                }
                resolve(followers);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
