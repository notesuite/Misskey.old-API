"use strict";
const db_1 = require('../../../db/db');
function default_1(user, folderId, name) {
    if (name.length > 100) {
        return Promise.reject('too-long-name');
    }
    return new Promise((resolve, reject) => {
        db_1.AlbumFolder.findOne({
            _id: folderId,
            user: user.id
        }, (folderFindErr, folder) => {
            if (folderFindErr !== null) {
                reject(folderFindErr);
            }
            else if (folder === null) {
                reject('folder-not-found');
            }
            else {
                folder.name = name;
                folder.save((saveErr, renamed) => {
                    if (saveErr !== null) {
                        return reject(saveErr);
                    }
                    resolve(renamed.toObject());
                });
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
