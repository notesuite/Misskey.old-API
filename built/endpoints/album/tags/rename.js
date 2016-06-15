"use strict";
const db_1 = require('../../../db/db');
const album_tag_1 = require('../../../spec/album-tag');
function default_1(user, tagId, name) {
    if (!album_tag_1.isName(name)) {
        return Promise.reject('invalid-name');
    }
    return new Promise((resolve, reject) => {
        db_1.AlbumTag.findById(tagId, (tagFindErr, tag) => {
            if (tagFindErr !== null) {
                return reject(tagFindErr);
            }
            else if (tag === null) {
                return reject('tag-not-found');
            }
            else if (tag.user.toString() !== user.id.toString()) {
                return reject('tag-not-found');
            }
            db_1.AlbumTag.findOne({
                name: name,
                user: user.id
            }, (tagFindErr2, existTag) => {
                if (tagFindErr2 !== null) {
                    return reject(tagFindErr2);
                }
                else if (existTag !== null) {
                    return reject('already-exist-tag');
                }
                tag.name = name;
                tag.save((saveErr, renamed) => {
                    if (saveErr !== null) {
                        return reject(saveErr);
                    }
                    resolve(renamed.toObject());
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
