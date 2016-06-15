"use strict";
const db_1 = require('../../../db/db');
function default_1(user) {
    return new Promise((resolve, reject) => {
        db_1.PostMention.find({
            user: user.id
        }, (findErr, mentions) => {
            Promise.all(mentions.map(mention => {
                return new Promise((resolve2, reject2) => {
                    mention.remove(() => {
                        resolve2();
                    });
                });
            })).then(() => {
                resolve();
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
