"use strict";
function default_1(user, tags) {
    tags = tags.trim();
    const tagEntities = tags.split(' ');
    if (tagEntities.length > 30) {
        return Promise.reject('too-many-tags');
    }
    return new Promise((resolve, reject) => {
        user.tags = tagEntities;
        user.save((saveErr, afterUser) => {
            if (saveErr !== null) {
                return reject(saveErr);
            }
            resolve(afterUser.toObject());
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
