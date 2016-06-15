"use strict";
const db_1 = require('../../../db/db');
const serialize_talk_message_1 = require('../../../core/serialize-talk-message');
const read_talk_message_1 = require('../../../core/read-talk-message');
function default_1(user, messageId) {
    return new Promise((resolve, reject) => {
        db_1.TalkMessage
            .findById(messageId)
            .exec((findErr, message) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (message === null) {
                return reject('message-not-found');
            }
            switch (message.type) {
                case 'user-message':
                    if (message._doc.recipient.toString() !== user.id.toString() &&
                        message._doc.user.toString() !== user.id.toString()) {
                        return reject('access-denied');
                    }
                    else if (message.isDeleted) {
                        return reject('this-message-has-been-deleted');
                    }
                    show();
                    break;
                case 'group-message':
                    db_1.TalkGroup
                        .findById(message._doc.group)
                        .exec((groupFindErr, group) => {
                        if (group.members
                            .map(member => member.toString())
                            .indexOf(user.id.toString()) === -1) {
                            return reject('access-denied');
                        }
                        else if (message.isDeleted) {
                            return reject('this-message-has-been-deleted');
                        }
                        show();
                    });
                    break;
                case 'group-send-invitation-activity':
                case 'group-member-join-activity':
                case 'group-member-left-activity':
                case 'rename-group-activity':
                case 'transfer-group-ownership-activity':
                    db_1.TalkGroup
                        .findById(message._doc.group)
                        .exec((groupFindErr, group) => {
                        if (group.members
                            .map(member => member.toString())
                            .indexOf(user.id.toString()) === -1) {
                            return reject('access-denied');
                        }
                        show();
                    });
                    break;
                default:
                    break;
            }
            function show() {
                serialize_talk_message_1.default(message, user).then(resolve, reject);
                read_talk_message_1.default(user, message);
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
