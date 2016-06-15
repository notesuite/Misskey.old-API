"use strict";
const db_1 = require('../../../../db/db');
const event_1 = require('../../../../event');
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
            db_1.TalkGroup.findById(invitation.group, (groupFindErr, group) => {
                if (groupFindErr !== null) {
                    return reject(groupFindErr);
                }
                else if (group === null) {
                    return reject('group-not-found');
                }
                group.members.push(me.id);
                group.markModified('members');
                group.save((saveErr, saved) => {
                    if (saveErr !== null) {
                        return reject(saveErr);
                    }
                    resolve();
                    invitation.remove();
                    db_1.TalkGroupMemberJoinActivity.create({
                        group: group.id,
                        joiner: me.id
                    }, (activityErr, createdActivity) => {
                        if (activityErr !== null) {
                            return;
                        }
                        event_1.default.publishGroupTalkMessage(createdActivity, group);
                    });
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
