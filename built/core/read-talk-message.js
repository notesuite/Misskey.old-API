"use strict";
const db_1 = require('../db/db');
const event_1 = require('../event');
function default_1(me, message) {
    return new Promise((resolve, reject) => {
        switch (message.type) {
            case 'user-message':
                if (message._doc.user.toString() === me.id.toString()) {
                    return reject('is-me');
                }
                db_1.TalkUserMessage.findByIdAndUpdate(message.id, { $set: { isRead: true } }, (_1, _2) => {
                });
                const otherpartyId = message._doc.user;
                event_1.default.publishReadTalkUserMessage(otherpartyId, me.id, message);
                break;
            case 'group-message':
                if (message._doc.user.toString() === me.id.toString()) {
                    return reject('is-me');
                }
                else if (message._doc.reads.indexOf(me.id.toString()) !== -1) {
                    return reject('arleady-read');
                }
                db_1.TalkGroupMessage.findByIdAndUpdate(message.id, { $set: { reads: message._doc.reads.concat(me.id) } }, (_1, _2) => {
                });
                event_1.default.publishReadTalkGroupMessage(message._doc.group, message);
                break;
            case 'group-send-invitation-activity':
            case 'group-member-join-activity':
                if (message._doc.reads.indexOf(me.id.toString()) !== -1) {
                    return reject('arleady-read');
                }
                db_1.TalkGroupMessage.findByIdAndUpdate(message.id, { $set: { reads: message._doc.reads.concat(me.id) } }, (_1, _2) => {
                });
                event_1.default.publishReadTalkGroupMessage(message._doc.group, message);
                break;
            default:
                resolve();
                break;
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
