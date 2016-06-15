"use strict";
function default_1(user, url) {
    url = url.trim();
    if (url.length > 100) {
        return Promise.reject('too-long-url');
    }
    return new Promise((resolve, reject) => {
        user.url = url;
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
