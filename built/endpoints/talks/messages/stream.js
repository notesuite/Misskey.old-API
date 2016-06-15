"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../../db/db');
const serialize_talk_message_1 = require('../../../core/serialize-talk-message');
const read_talk_message_1 = require('../../../core/read-talk-message');
function default_1(me, limit = 10, sinceId = null, maxId = null, userId = null, groupId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 30) {
        return Promise.reject('30 made');
    }
    return new Promise((resolve, reject) => {
        if (userId !== null) {
            getUserStream();
        }
        else if (groupId !== null) {
            getGroupStream();
        }
        else {
            reject('empty-destination-query');
        }
        function getUserStream() {
            const query = Object.assign({
                $or: [{
                        user: me.id,
                        recipient: userId
                    }, {
                        user: userId,
                        recipient: me.id
                    }]
            }, new powerful_1.Match(null)
                .when(() => sinceId !== null, () => {
                return { _id: { $gt: sinceId } };
            })
                .when(() => maxId !== null, () => {
                return { _id: { $lt: maxId } };
            })
                .getValue({}));
            db_1.TalkUserMessage
                .find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec((err, messages) => {
                if (err !== null) {
                    return reject(err);
                }
                else if (isEmpty(messages)) {
                    return resolve([]);
                }
                Promise.all(messages.map(message => serialize_talk_message_1.default(message, me))).then(resolve, reject);
                messages.forEach(message => {
                    read_talk_message_1.default(me, message);
                });
            });
        }
        function getGroupStream() {
            db_1.TalkGroup
                .findById(groupId)
                .exec((groupFindErr, group) => {
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
                const query = Object.assign({
                    group: group.id,
                }, new powerful_1.Match(null)
                    .when(() => sinceId !== null, () => {
                    return { _id: { $gt: sinceId } };
                })
                    .when(() => maxId !== null, () => {
                    return { _id: { $lt: maxId } };
                })
                    .getValue({}));
                db_1.TalkGroupMessageBase
                    .find(query)
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .exec((err, messages) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    else if (isEmpty(messages)) {
                        return resolve([]);
                    }
                    Promise.all(messages.map(message => serialize_talk_message_1.default(message, me))).then(resolve, reject);
                    messages.forEach(message => {
                        read_talk_message_1.default(me, message);
                    });
                });
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
