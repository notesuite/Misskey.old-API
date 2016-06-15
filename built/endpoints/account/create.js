"use strict";
const bcrypt = require('bcrypt');
const db_1 = require('../../db/db');
const user_1 = require('../../spec/user');
function default_1(isOfficial, screenName, password) {
    return (!isOfficial) ?
        Promise.reject('access-denied')
        : (screenName === undefined || screenName === null || screenName === '') ?
            Promise.reject('empty-screen-name')
            : (!user_1.isScreenName(screenName) || user_1.isReservedScreenName(screenName)) ?
                Promise.reject('invalid-screen-name')
                : (password === undefined || password === null || password === '') ?
                    Promise.reject('empty-password')
                    :
                        (() => {
                            const salt = bcrypt.genSaltSync(14);
                            const encryptedPassword = bcrypt.hashSync(password, salt);
                            return Promise.resolve(db_1.User.create({
                                screenName: screenName,
                                screenNameLower: screenName.toLowerCase(),
                                name: 'no name',
                                lang: 'ja',
                                credit: 3000,
                                encryptedPassword: encryptedPassword
                            }));
                        })();
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
