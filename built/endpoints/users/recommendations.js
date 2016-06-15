"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../db/db');
const serialize_user_1 = require('../../core/serialize-user');
function default_1(me, limit = 4) {
    return new Promise((resolve, reject) => {
        db_1.UserFollowing.find({
            follower: me.id
        }, (followingFindErr, following) => {
            if (followingFindErr !== null) {
                return reject(followingFindErr);
            }
            const ignoreIds = !isEmpty(following)
                ? [...following.map(follow => follow.followee.toString()), me.id]
                : [me.id];
            db_1.User.find({
                _id: { $nin: ignoreIds }
            })
                .sort({
                followersCount: -1
            })
                .limit(limit)
                .exec((searchErr, users) => {
                if (searchErr !== null) {
                    reject('something-happened');
                }
                else if (isEmpty(users)) {
                    resolve([]);
                }
                else {
                    Promise.all(users.map(user => serialize_user_1.default(me, user)))
                        .then(serializedUsers => {
                        resolve(serializedUsers);
                    }, (err) => {
                        reject('something-happened');
                    });
                }
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
