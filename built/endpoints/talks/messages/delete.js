"use strict";
const db_1 = require('../../../db/db');
const event_1 = require('../../../event');
function isUserMessage(message) {
    return message.type === 'user-message';
}
function default_1(user, messageId) {
    if (messageId === '') {
        return Promise.reject('empty-message-id');
    }
    return new Promise((resolve, reject) => {
        db_1.TalkMessage.findOne({
            _id: messageId,
            user: user.id
        }, (findErr, message) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (message === null) {
                return reject('message-not-found');
            }
            else if (message.user.toString() !== user.id.toString()) {
                return reject('message-not-found');
            }
            else if (message.isDeleted) {
                return reject('this-message-has-already-been-deleted');
            }
            message.isDeleted = true;
            message.save((saveErr) => {
                if (saveErr !== null) {
                    return reject(saveErr);
                }
                resolve();
                if (isUserMessage(message)) {
                    event_1.default.publishDeleteTalkUserMessage(user.id, message.recipient, message);
                }
                else {
                    event_1.default.publishDeleteTalkGroupMessage(message.group, message);
                }
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
