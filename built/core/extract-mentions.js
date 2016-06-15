"use strict";
const db_1 = require('../db/db');
function default_1(text) {
    if (text === null) {
        return Promise.resolve(null);
    }
    const mentions = text.match(/@[a-zA-Z0-9\-]+/g);
    if (mentions === null) {
        return Promise.resolve(null);
    }
    return Promise.all(mentions.map(mention => new Promise((resolve, reject) => {
        const sn = mention.replace('@', '');
        db_1.User.findOne({ screenNameLower: sn.toLowerCase() }, (err, user) => {
            if (err !== null) {
                reject(err);
            }
            else {
                resolve(user);
            }
        });
    })));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
