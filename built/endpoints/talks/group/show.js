"use strict";
const db_1 = require('../../../db/db');
function default_1(user, groupId) {
    return new Promise((resolve, reject) => {
        db_1.TalkGroup
            .findById(groupId)
            .populate('owner members')
            .exec((findErr, group) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (group === null) {
                return reject('group-not-found');
            }
            else if (group.members
                .map(member => member.id.toString())
                .indexOf(user.id.toString()) === -1) {
                return reject('access-denied');
            }
            resolve(group.toObject());
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
