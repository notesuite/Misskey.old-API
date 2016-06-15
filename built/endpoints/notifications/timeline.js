"use strict";
const powerful_1 = require('powerful');
const db_1 = require('../../db/db');
const serialize_notification_1 = require('../../core/serialize-notification');
function default_1(user, limit = 10, sinceId = null, maxId = null) {
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 30) {
        return Promise.reject('30 made');
    }
    return new Promise((resolve, reject) => {
        const query = new powerful_1.Match(null)
            .when(() => sinceId !== null, () => {
            return {
                user: user.id,
                _id: { $gt: sinceId }
            };
        })
            .when(() => maxId !== null, () => {
            return {
                user: user.id,
                _id: { $lt: maxId }
            };
        })
            .getValue({ user: user.id });
        db_1.Notification
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec((err, notifications) => {
            if (err !== null) {
                return reject(err);
            }
            else if (notifications.length === 0) {
                return resolve([]);
            }
            Promise.all(notifications.map(notification => serialize_notification_1.default(notification.toObject(), user)))
                .then(resolve);
            notifications.forEach(notification => {
                notification.isRead = true;
                notification.save();
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
