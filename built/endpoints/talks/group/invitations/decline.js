"use strict";
const db_1 = require('../../../../db/db');
function default_1(app, me, invitationId) {
    return new Promise((resolve, reject) => {
        db_1.TalkGroupInvitation.findById(invitationId, (invitationFindErr, invitation) => {
            if (invitationFindErr !== null) {
                return reject(invitationFindErr);
            }
            else if (invitation === null) {
                return reject('invitation-not-found');
            }
            else if (invitation.user.toString() !== me.id.toString()) {
                return reject('invitation-not-found');
            }
            invitation.isDeclined = true;
            invitation.save((saveErr, saved) => {
                resolve();
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
