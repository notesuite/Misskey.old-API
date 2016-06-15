"use strict";
const db_1 = require('../../../db/db');
const read_talk_message_1 = require('../../../core/read-talk-message');
function default_1(user, messageId) {
    return new Promise((resolve, reject) => {
        db_1.TalkMessage.findById(messageId, (findErr, message) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (message === null) {
                return reject('message-not-found');
            }
            switch (message.type) {
                case 'user-message':
                    if (message._doc.user.toString() === user.id.toString()) {
                        return reject('access-denied');
                    }
                    else if (message._doc.recipient.toString() !== user.id.toString()) {
                        return reject('access-denied');
                    }
                    else if (message._doc.isDeleted) {
                        return reject('this-message-has-been-deleted');
                    }
                    else if (message._doc.isRead) {
                        return reject('this-message-has-already-been-read');
                    }
                    read_talk_message_1.default(user, message).then(resolve, reject);
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
                        read_talk_message_1.default(user, message).then(resolve, reject);
                    });
                    break;
                default:
                    break;
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
