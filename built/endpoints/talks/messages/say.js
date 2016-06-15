"use strict";
const db_1 = require('../../../db/db');
const get_album_file_1 = require('../../../core/get-album-file');
const create_notification_1 = require('../../../core/create-notification');
const event_1 = require('../../../event');
function default_1(app, user, text, fileId = null, userId = null, groupId = null) {
    const maxTextLength = 500;
    text = text.trim();
    if (fileId === null && (text === undefined || text === null || text === '')) {
        return Promise.reject('empty-text');
    }
    if (text.length > maxTextLength) {
        return Promise.reject('too-long-text');
    }
    if (userId !== null) {
        const otherpartyId = userId;
        if (otherpartyId === user.id.toString()) {
            return Promise.reject('no-yourself');
        }
        return new Promise((resolve, reject) => {
            db_1.User.findById(otherpartyId, (checkErr, recipient) => {
                if (checkErr !== null) {
                    return reject(checkErr);
                }
                else if (recipient === null) {
                    return reject('recipient-not-found');
                }
                if (fileId !== null) {
                    get_album_file_1.default(user.id, fileId).then(file => {
                        createUserMessage(resolve, reject, user, recipient, text, file);
                    }, reject);
                }
                else {
                    createUserMessage(resolve, reject, user, recipient, text);
                }
            });
        });
    }
    else if (groupId !== null) {
        return new Promise((resolve, reject) => {
            db_1.TalkGroup.findById(groupId, (checkErr, group) => {
                if (checkErr !== null) {
                    return reject(checkErr);
                }
                else if (group === null) {
                    return reject('group-not-found');
                }
                else if (group.members
                    .map(member => member.toString())
                    .indexOf(user.id.toString()) === -1) {
                    return reject('access-denied');
                }
                if (fileId !== null) {
                    get_album_file_1.default(user.id, fileId).then(file => {
                        createGroupMessage(resolve, reject, user, group, text, file);
                    }, reject);
                }
                else {
                    createGroupMessage(resolve, reject, user, group, text);
                }
            });
        });
    }
    else {
        return Promise.reject('empty-destination-query');
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function createUserMessage(resolve, reject, me, recipient, text, file = null) {
    db_1.TalkUserMessage.create({
        user: me.id,
        recipient: recipient.id,
        text: text,
        file: file !== null ? file.id : null
    }, (createErr, createdMessage) => {
        if (createErr !== null) {
            return reject(createErr);
        }
        resolve(createdMessage.toObject());
        event_1.default.publishUserTalkMessage(me.id, recipient.id, createdMessage);
        db_1.TalkUserHistory.findOne({
            type: 'user',
            user: me.id,
            recipient: recipient.id
        }, (findHistoryErr, history) => {
            if (findHistoryErr !== null) {
                return;
            }
            if (history === null) {
                db_1.TalkUserHistory.create({
                    user: me.id,
                    recipient: recipient.id,
                    message: createdMessage.id
                });
            }
            else {
                history.updatedAt = Date.now();
                history.message = createdMessage.id;
                history.save();
            }
        });
        db_1.TalkUserHistory.findOne({
            type: 'user',
            user: recipient.id,
            recipient: me.id
        }, (findHistoryErr, history) => {
            if (findHistoryErr !== null) {
                return;
            }
            if (history === null) {
                db_1.TalkUserHistory.create({
                    user: recipient.id,
                    recipient: me.id,
                    message: createdMessage.id
                });
            }
            else {
                history.updatedAt = Date.now();
                history.message = createdMessage.id;
                history.save();
            }
        });
        setTimeout(() => {
            db_1.TalkUserMessage.findById(createdMessage.id, (reloadErr, reloadedMessage) => {
                if (reloadErr !== null) {
                    return;
                }
                else if (reloadedMessage.isRead) {
                    return;
                }
                create_notification_1.default(null, recipient.id, 'talk-user-message', {
                    messageId: createdMessage.id
                });
            });
        }, 3000);
    });
}
function createGroupMessage(resolve, reject, me, group, text, file = null) {
    db_1.TalkGroupMessage.create({
        user: me.id,
        group: group.id,
        text: text,
        file: file !== null ? file.id : null
    }, (createErr, createdMessage) => {
        if (createErr !== null) {
            return reject(createErr);
        }
        resolve(createdMessage.toObject());
        event_1.default.publishGroupTalkMessage(createdMessage, group);
        group.members.forEach(member => {
            db_1.TalkGroupHistory.findOne({
                type: 'group',
                user: member,
                group: group.id
            }, (findHistoryErr, history) => {
                if (findHistoryErr !== null) {
                    return;
                }
                if (history === null) {
                    db_1.TalkGroupHistory.create({
                        user: member,
                        group: group.id,
                        message: createdMessage.id
                    });
                }
                else {
                    history.updatedAt = Date.now();
                    history.message = createdMessage.id;
                    history.save();
                }
            });
        });
    });
}
