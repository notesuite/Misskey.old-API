"use strict";
const lookup_follow_state_1 = require('./lookup-follow-state');
function default_1(me, user) {
    const userObj = user.toObject();
    return (me !== undefined && me !== null) ?
        Promise.all([lookup_follow_state_1.default(me.id, user.id), lookup_follow_state_1.default(user.id, me.id)])
            .then(([isFollowing, isFollowed]) => {
            userObj.isFollowing = isFollowing;
            userObj.isFollowed = isFollowed;
            return userObj;
        })
        :
            Promise.resolve(userObj);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
