"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../../db/db');
const serialize_talk_message_1 = require('../../../core/serialize-talk-message');
function default_1(user, type = null, limit = 30) {
    return new Promise((resolve, reject) => {
        let query = {
            user: user.id
        };
        switch (type) {
            case 'user':
                query.type = 'user';
                break;
            case 'group':
                query.type = 'group';
                break;
            default:
                break;
        }
        db_1.TalkHistory
            .find(query)
            .sort('-updatedAt')
            .limit(limit)
            .populate('message')
            .exec((err, histories) => {
            if (err !== null) {
                return reject(err);
            }
            else if (isEmpty(histories)) {
                return resolve([]);
            }
            const messages = histories.map(history => history.message);
            Promise.all(messages.map(message => serialize_talk_message_1.default(message, user, true))).then(resolve, reject);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
