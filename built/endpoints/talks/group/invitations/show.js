"use strict";
const db_1 = require('../../../../db/db');
function default_1(app, me) {
    return new Promise((resolve, reject) => {
        db_1.TalkGroupInvitation.find({
            user: me.id,
            isDeclined: false
        })
            .populate('group')
            .exec((invitationsFindErr, invitations) => {
            if (invitationsFindErr !== null) {
                return reject(invitationsFindErr);
            }
            else if (invitations.length === 0) {
                return resolve([]);
            }
            resolve(invitations.map(invitation => invitation.toObject()));
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
