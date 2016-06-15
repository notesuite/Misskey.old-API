"use strict";
const db_1 = require('../../../db/db');
function default_1(user) {
    return new Promise((resolve, reject) => {
        db_1.AlbumTag.find({
            user: user.id,
        }, (findErr, tags) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            resolve(tags.map(tag => tag.toObject()));
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
