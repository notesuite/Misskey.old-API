"use strict";
const mongoose_1 = require('mongoose');
function default_1(db) {
    const schema = new mongoose_1.Schema({
        createdAt: { type: Date, required: true, default: Date.now },
        followee: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        follower: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
    });
    return db.model('UserFollowing', schema, 'UserFollowings');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
