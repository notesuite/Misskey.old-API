"use strict";
const db_1 = require('../../../../db/db');
function default_1(user) {
    return new Promise((resolve, reject) => {
        db_1.PostMention
            .find({
            user: user.id,
            isRead: false
        })
            .limit(100)
            .count((err, count) => {
            if (err !== null) {
                return reject(err);
            }
            resolve(count);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
