"use strict";
const db_1 = require('../../../db/db');
function default_1(user, fileId, tagsString) {
    return new Promise((resolve, reject) => {
        if (tagsString !== undefined && tagsString !== null) {
            const tagIds = tagsString
                .split(',')
                .map(tagId => tagId.trim())
                .filter(tagId => tagId !== '')
                .filter((x, i, self) => self.indexOf(x) === i);
            if (tagIds.length > 0) {
                Promise.all(tagIds.map(tagId => new Promise((resolve2, reject2) => {
                    db_1.AlbumTag.findById(tagId, (tagFindErr, tag) => {
                        if (tagFindErr !== null) {
                            reject2(tagFindErr);
                        }
                        else if (tag === null) {
                            reject2('tag-not-found');
                        }
                        else if (tag.user.toString() !== user.id.toString()) {
                            reject2('tag-not-found');
                        }
                        else {
                            resolve2();
                        }
                    });
                })))
                    .then(files => {
                    update(tagIds);
                }, (err) => {
                    reject(err);
                });
            }
            else {
                update([]);
            }
        }
        else {
            update([]);
        }
        function update(tags) {
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
                file.tags = tags;
                file.markModified('tags');
                file.save((err) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    resolve(file.toObject());
                });
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
