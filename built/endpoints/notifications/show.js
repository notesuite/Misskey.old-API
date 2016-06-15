"use strict";
const db_1 = require('../../db/db');
const serialize_notification_1 = require('../../core/serialize-notification');
function default_1(shower, id) {
    return new Promise((resolve, reject) => {
        db_1.Notification.findById(id, (findErr, notification) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (notification === null) {
                return reject('not-found');
            }
            else if (notification.user.toString() !== shower.id.toString()) {
                return reject('not-found');
            }
            serialize_notification_1.default(notification.toObject(), shower).then((serialized) => {
                resolve(serialized);
            }, (err) => {
                reject(err);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
