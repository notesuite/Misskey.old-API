"use strict";
function default_1(user, comment) {
    comment = comment.trim();
    if (comment.length > 50) {
        return Promise.reject('too-long-comment');
    }
    return new Promise((resolve, reject) => {
        user.comment = comment;
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
