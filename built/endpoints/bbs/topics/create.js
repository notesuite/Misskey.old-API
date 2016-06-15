"use strict";
const db_1 = require('../../../db/db');
function default_1(app, user, title) {
    title = title.trim();
    if (title.length === 0) {
        return Promise.reject('empty-title');
    }
    if (title.length > 100) {
        return Promise.reject('too-long-title');
    }
    return new Promise((resolve, reject) => {
        db_1.BBSTopic.create({
            user: user.id,
            title: title
        }, (createErr, topic) => {
            if (createErr !== null) {
                return reject(createErr);
            }
            resolve(topic.toObject());
            db_1.BBSWatching.create({
                user: user.id,
                topic: topic.id
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
