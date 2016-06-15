"use strict";
const db_1 = require('../../db/db');
const serialize_user_1 = require('../../core/serialize-user');
function default_1(me, id, screenName) {
    return new Promise((resolve, reject) => {
        function resolver(user) {
            if (user === null) {
                return reject('not-found');
            }
            serialize_user_1.default(me, user).then(serializedUser => {
                resolve(serializedUser);
            }, (err) => {
                reject('something-happened');
            });
        }
        if (id !== undefined && id !== null) {
            db_1.User.findById(id, (err, user) => {
                if (err !== null) {
                    reject(err);
                }
                else {
                    resolver(user);
                }
            });
        }
        else if (screenName !== undefined && screenName !== null) {
            db_1.User.findOne({ screenNameLower: screenName.toLowerCase() }, (err, user) => {
                if (err !== null) {
                    reject(err);
                }
                else {
                    resolver(user);
                }
            });
        }
        else {
            reject('empty-query');
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
