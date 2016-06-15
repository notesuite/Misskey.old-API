"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../db/db');
function default_1(screenName) {
    if (screenName) {
        return Promise.resolve(db_1.User.find({
            screenNameLower: screenName.toLowerCase()
        }).limit(1).exec()).then(isEmpty);
    }
    else {
        return Promise.reject('empty-screen-name');
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
