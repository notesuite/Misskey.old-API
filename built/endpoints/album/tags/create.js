"use strict";
const db_1 = require('../../../db/db');
const album_tag_1 = require('../../../spec/album-tag');
function default_1(user, name, color) {
    if (!album_tag_1.isName(name)) {
        return Promise.reject('invalid-name');
    }
    if (!album_tag_1.isColor(color)) {
        return Promise.reject('invalid-color');
    }
    return new Promise((resolve, reject) => {
        db_1.AlbumTag.findOne({
            name: name,
            user: user.id
        }, (tagFindErr, existTag) => {
            if (tagFindErr !== null) {
                return reject(tagFindErr);
            }
            else if (existTag !== null) {
                return reject('already-exist-tag');
            }
            db_1.AlbumTag.create({
                user: user.id,
                name: name,
                color: color
            }, (createErr, tag) => {
                if (createErr !== null) {
                    return reject(createErr);
                }
                resolve(tag.toObject());
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
