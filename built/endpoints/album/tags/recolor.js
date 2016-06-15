"use strict";
const db_1 = require('../../../db/db');
const album_tag_1 = require('../../../spec/album-tag');
function default_1(user, tagId, color) {
    if (!album_tag_1.isColor(color)) {
        return Promise.reject('invalid-color');
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
            tag.color = color;
            tag.save((saveErr, saved) => {
                if (saveErr !== null) {
                    return reject(saveErr);
                }
                resolve(saved.toObject());
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
