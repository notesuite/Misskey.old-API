"use strict";
const db_1 = require('../../../db/db');
function default_1(user, tagId) {
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
            tag.remove(() => {
                resolve('kyoppie');
            });
            db_1.AlbumFile.find({
                tags: tag.id
            }, (findErr, files) => {
                if (findErr === null && files.length > 0) {
                    files.forEach(file => {
                        file.tags = file.tags.filter(tag2 => tag2.toString() !== tag.id.toString());
                        file.markModified('tags');
                        file.save();
                    });
                }
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
