"use strict";
const db_1 = require('../../../db/db');
const user_1 = require('../../../spec/user');
function default_1(user, folderId, color) {
    if (!user_1.isColor(color)) {
        return Promise.reject('invalid-format');
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
                folder.color = color;
                folder.save((saveErr, recolored) => {
                    if (saveErr !== null) {
                        return reject(saveErr);
                    }
                    resolve(recolored.toObject());
                });
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
