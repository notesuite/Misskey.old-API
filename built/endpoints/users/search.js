"use strict";
const db_1 = require('../../db/db');
const serialize_user_1 = require('../../core/serialize-user');
const escape_regexp_1 = require('../../core/escape-regexp');
function default_1(me, query, limit = 5) {
    query = escape_regexp_1.default(query.toLowerCase());
    limit = parseInt(limit, 10);
    if (limit < 1) {
        return Promise.reject('1 kara');
    }
    else if (limit > 30) {
        return Promise.reject('30 made');
    }
    const [searchType, dbQuery] = /^@?[a-zA-Z0-9\-]+$/.exec(query)
        ? ['screen-name', {
                screenNameLower: new RegExp(query.replace('@', ''))
            }]
        : ['name', {
                name: new RegExp(query, 'i')
            }];
    return new Promise((resolve, reject) => {
        db_1.User
            .find(dbQuery)
            .sort({
            followersCount: -1
        })
            .limit(limit)
            .exec((err, users) => {
            if (searchType === 'screen-name' && users.length < limit) {
                db_1.User.find({
                    name: new RegExp(query, 'i'),
                    _id: { $nin: users.map(user => user.id) }
                }).sort({
                    followersCount: -1
                })
                    .limit(limit - users.length)
                    .exec((err2, users2) => {
                    resolver([...users, ...users2]);
                });
            }
            else {
                resolver(users);
            }
        });
        function resolver(users) {
            Promise.all(users.map(user => serialize_user_1.default(me, user)))
                .then(serializedUsers => {
                resolve(serializedUsers);
            }, (err) => {
                reject('something-happened');
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
