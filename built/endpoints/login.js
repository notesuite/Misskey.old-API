"use strict";
const bcrypt = require('bcrypt');
const db_1 = require('../db/db');
function default_1(screenName, password) {
    screenName = screenName.trim();
    if (screenName === '') {
        return Promise.reject('empty-screen-name');
    }
    return new Promise((resolve, reject) => {
        db_1.User.findOne({
            screenNameLower: screenName.toLowerCase()
        }, (findErr, user) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (user === null) {
                return reject('user-not-found');
            }
            bcrypt.compare(password, user.encryptedPassword, (compareErr, same) => {
                if (compareErr !== undefined && compareErr !== null) {
                    return reject(compareErr);
                }
                else if (!same) {
                    return reject('failed');
                }
                resolve(user.toObject());
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
