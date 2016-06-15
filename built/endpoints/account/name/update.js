"use strict";
const user_1 = require('../../../spec/user');
function default_1(user, name) {
    name = name.trim();
    if (!user_1.isName(name)) {
        return Promise.reject('invalid-name');
    }
    return new Promise((resolve, reject) => {
        user.name = name;
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
