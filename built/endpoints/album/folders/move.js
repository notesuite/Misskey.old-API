"use strict";
const db_1 = require('../../../db/db');
function default_1(user, folderId, destinationFolderId) {
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
                if (destinationFolderId !== null) {
                    db_1.AlbumFolder.findOne({
                        _id: destinationFolderId,
                        user: user.id
                    }, (destinationFolderIdFindErr, destinationFolder) => {
                        if (destinationFolderIdFindErr !== null) {
                            reject(destinationFolderIdFindErr);
                        }
                        else if (folder === null) {
                            reject('destination-folder-not-found');
                        }
                        else {
                            folder.parent = destinationFolder.id;
                            folder.save((saveErr, moved) => {
                                if (saveErr !== null) {
                                    return reject(saveErr);
                                }
                                resolve(moved.toObject());
                            });
                        }
                    });
                }
                else {
                    folder.parent = null;
                    folder.save((saveErr, moved) => {
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
