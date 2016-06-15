"use strict";
const db_1 = require('../../../db/db');
function default_1(user, fileId, tagId) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFile.findOne({
            _id: fileId,
            user: user.id
        }, (findErr, file) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (file === null) {
                return reject('file-not-found');
            }
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
                if (file.tags.filter(tag2 => tag2.toString() === tag.id.toString()).length !== 0) {
                    return reject('already-added-tag');
                }
                file.tags.push(tag.id);
                file.markModified('tags');
                file.save((err) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    resolve(file.toObject());
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
