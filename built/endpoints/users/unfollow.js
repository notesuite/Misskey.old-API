"use strict";
const db_1 = require('../../db/db');
function default_1(follower, followeeId) {
    return new Promise((resolve, reject) => {
        if (follower.id.toString() === followeeId) {
            reject('followee-is-you');
        }
        else {
            db_1.User.findById(followeeId, (userFindErr, followee) => {
                if (userFindErr !== null) {
                    reject(userFindErr);
                }
                else if (followee === null) {
                    reject('followee-not-found');
                }
                else {
                    db_1.UserFollowing.findOne({
                        followee: followeeId,
                        follower: follower.id
                    }, (followingFindErr, userFollowing) => {
                        if (followingFindErr !== null) {
                            reject(followingFindErr);
                        }
                        else if (userFollowing === null) {
                            reject("not-following");
                        }
                        else {
                            userFollowing.remove((followingRemoveErr) => {
                                if (followingRemoveErr !== null) {
                                    reject(followingRemoveErr);
                                }
                                else {
                                    follower.followingCount--;
                                    follower.save();
                                    followee.followersCount--;
                                    followee.save();
                                    resolve();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
