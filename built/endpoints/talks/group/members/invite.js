"use strict";
const db_1 = require('../../../../db/db');
const event_1 = require('../../../../event');
function default_1(app, me, groupId, userId, text = null) {
    if (text !== null) {
        text = text.trim();
        if (text.length > 200) {
            return Promise.reject('too-long-message');
        }
        if (text === '') {
            text = null;
        }
    }
    return new Promise((resolve, reject) => {
        if (me.id.toString() === userId) {
            return reject('invitee-is-youself');
        }
        db_1.TalkGroup.findById(groupId, (groupFindErr, group) => {
            if (groupFindErr !== null) {
                return reject(groupFindErr);
            }
            else if (group === null) {
                return reject('group-not-found');
            }
            else if (group.members
                .map(member => member.toString())
                .indexOf(me.id.toString()) === -1) {
                return reject('access-denied');
            }
            db_1.User.findById(userId, (inviteeFindErr, invitee) => {
                if (inviteeFindErr !== null) {
                    return reject(inviteeFindErr);
                }
                else if (invitee === null) {
                    return reject('invitee-not-found');
                }
                else if (group.members
                    .map(member => member.toString())
                    .indexOf(invitee.id.toString()) > -1) {
                    return reject('invitee-is-already-joined');
                }
                db_1.TalkGroupInvitation.findOne({
                    group: group.id,
                    user: invitee.id
                }, (invitationFindErr, existInvitation) => {
                    if (invitationFindErr !== null) {
                        return reject(invitationFindErr);
                    }
                    else if (existInvitation !== null && existInvitation.isDeclined) {
                        return reject('invitation-is-already-declined');
                    }
                    else if (existInvitation !== null && !existInvitation.isDeclined) {
                        return reject('already-invite');
                    }
                    db_1.TalkGroupInvitation.create({
                        group: group.id,
                        user: invitee.id,
                        text: text
                    }, (createErr, invitation) => {
                        if (createErr !== null) {
                            return reject(createErr);
                        }
                        resolve(invitation.toObject());
                        db_1.TalkGroupSendInvitationActivity.create({
                            group: group.id,
                            invitee: invitee.id,
                            inviter: me.id,
                            invitation: invitation.id
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
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
