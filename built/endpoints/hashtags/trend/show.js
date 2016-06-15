"use strict";
const powerful_1 = require('powerful');
const isEmpty = powerful_1.List.isEmpty;
const db_1 = require('../../../db/db');
function default_1() {
    return new Promise((resolve, reject) => {
        db_1.Hashtag.find({})
            .sort({
            count: -1
        })
            .limit(16)
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
