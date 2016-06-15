"use strict";
const db_1 = require('../../../db/db');
const talk_group_1 = require('../../../spec/talk-group');
function default_1(app, me, name) {
    name = name.trim();
    if (!talk_group_1.isName(name)) {
        return Promise.reject('invalid-name');
    }
    return new Promise((resolve, reject) => {
        db_1.TalkGroup.create({
            owner: me.id,
            members: [me.id],
            name: name
        }, (createErr, group) => {
            if (createErr !== null) {
                return reject(createErr);
            }
            resolve(group.toObject());
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
