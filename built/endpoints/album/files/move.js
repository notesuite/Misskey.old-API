"use strict";
const db_1 = require('../../../db/db');
function default_1(user, fileId, folderId = null) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFile.findOne({
            _id: fileId,
            user: user.id
        }, (findErr, file) => {
            if (findErr !== null) {
                reject(findErr);
            }
            else if (file === null) {
                reject('file-not-found');
            }
            else {
                if (folderId !== null) {
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
                            file.folder = folder.id;
                            file.save((saveErr, moved) => {
                                if (saveErr !== null) {
                                    return reject(saveErr);
                                }
                                resolve(moved.toObject());
                            });
                        }
                    });
                }
                else {
                    file.folder = null;
                    file.save((saveErr, moved) => {
                        if (saveErr !== null) {
                            return reject(saveErr);
                        }
                        resolve(moved.toObject());
                    });
                }
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
