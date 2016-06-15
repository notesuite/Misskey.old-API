"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../db/db');
const escape_regexp_1 = require('../../core/escape-regexp');
function default_1(query) {
    return new Promise((resolve, reject) => {
        db_1.Hashtag.find({
            name: new RegExp(escape_regexp_1.default(query), 'i')
        })
            .sort({
            count: -1
        })
            .limit(30)
            .exec((searchErr, hashtags) => {
            if (searchErr !== null) {
                reject('something-happened');
            }
            else if (isEmpty(hashtags)) {
                resolve([]);
            }
            else {
                resolve(hashtags.map(hashtag => hashtag.name));
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
