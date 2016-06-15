"use strict";
const db_1 = require('../db/db');
const event_1 = require('../event');
function default_1(app, userId, type, content) {
    return new Promise((resolve, reject) => {
        db_1.Notification.create({
            app: app !== null ? app.id : null,
            user: userId,
            type: type,
            content: content
        }, (createErr, createdNotification) => {
            if (createErr !== null) {
                reject(createErr);
            }
            else {
                resolve(createdNotification);
                event_1.default.publishNotification(createdNotification);
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
