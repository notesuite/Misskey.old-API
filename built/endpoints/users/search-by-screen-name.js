"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../db/db');
const serialize_user_1 = require('../../core/serialize-user');
const escape_regexp_1 = require('../../core/escape-regexp');
function default_1(me, screenName) {
    const screenNameLower = escape_regexp_1.default(screenName.toLowerCase());
    return new Promise((resolve, reject) => {
        db_1.User.find({
            screenNameLower: new RegExp(screenNameLower)
        })
            .sort({
            followersCount: -1
        })
            .limit(30)
            .exec((searchErr, users) => {
            if (searchErr !== null) {
                return reject('something-happened');
            }
            else if (isEmpty(users)) {
                return resolve([]);
            }
            Promise.all(users.map(user => serialize_user_1.default(me, user)))
                .then(serializedUsers => {
                resolve(serializedUsers);
            }, (err) => {
                reject('something-happened');
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
