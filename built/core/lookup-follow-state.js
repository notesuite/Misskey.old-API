"use strict";
const db_1 = require('../db/db');
function default_1(meId, otherpartyId) {
    return new Promise((resolve, reject) => {
        db_1.UserFollowing.findOne({
            followee: otherpartyId,
            follower: meId
        }, (followingFindErr, userFollowing) => {
            if (followingFindErr !== null) {
                reject(followingFindErr);
            }
            else {
                resolve(userFollowing !== null);
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
