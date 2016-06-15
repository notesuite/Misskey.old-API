"use strict";
const db_1 = require('../../../db/db');
function default_1(user, fileId) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFile
            .findById(fileId)
            .populate('tags')
            .exec((findErr, file) => {
            if (findErr !== null) {
                reject(findErr);
            }
            else if (file === null) {
                reject('file-not-found');
            }
            else if (file.user.toString() !== user.id) {
                reject('file-not-found');
            }
            else {
                resolve(file.toObject());
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
