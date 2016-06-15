"use strict";
const db_1 = require('../../db/db');
function default_1(user) {
    return new Promise((resolve, reject) => {
        db_1.Notification.find({
            user: user.id
        }, (findErr, notifications) => {
            Promise.all(notifications.map(notification => {
                return new Promise((resolve2, reject2) => {
                    notification.remove(() => {
                        resolve2();
                    });
                });
            })).then(() => {
                resolve();
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
