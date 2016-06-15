"use strict";
function default_1(user, location) {
    location = location.trim();
    if (location.length > 50) {
        return Promise.reject('too-long-location');
    }
    return new Promise((resolve, reject) => {
        user.location = location;
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
