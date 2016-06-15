"use strict";
const db_1 = require('../../db/db');
const create_notification_1 = require('../../core/create-notification');
function default_1(follower, followeeId) {
    return new Promise((resolve, reject) => {
        if (follower.id.toString() === followeeId) {
            return reject('followee-is-you');
        }
        db_1.User.findById(followeeId, (userFindErr, followee) => {
            if (userFindErr !== null) {
                return reject(userFindErr);
            }
            else if (followee === null) {
                return reject('followee-not-found');
            }
            db_1.UserFollowing.findOne({
                followee: followeeId,
                follower: follower.id
            }, (followingFindErr, userFollowing) => {
                if (followingFindErr !== null) {
                    return reject(followingFindErr);
                }
                else if (userFollowing !== null) {
                    return reject('already-following');
                }
                db_1.UserFollowing.create({
                    followee: followeeId,
                    follower: follower.id
                }, (createErr, createdUserFollowing) => {
                    if (createErr !== null) {
                        return reject(createErr);
                    }
                    follower.followingCount++;
                    follower.save();
                    followee.followersCount++;
                    followee.save();
                    resolve();
                    create_notification_1.default(null, followeeId, 'follow', {
                        userId: follower.id
                    });
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
