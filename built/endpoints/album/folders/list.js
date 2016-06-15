"use strict";
const db_1 = require('../../../db/db');
function default_1(user, folderId = null) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFolder.find({
            user: user.id,
            parent: folderId
        }, (foldersFindErr, folders) => {
            if (foldersFindErr !== null) {
                return reject(foldersFindErr);
            }
            resolve(folders.map(folder => folder.toObject()));
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
