"use strict";
const db_1 = require('../../../db/db');
const delete_1 = require('../files/delete');
function default_1(user, folderId = null) {
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
                db_1.AlbumFile.find({
                    user: user.id, folder: folderId
                }, (filesFindErr, files) => {
                    if (filesFindErr !== null) {
                        return reject(filesFindErr);
                    }
                    Promise.all(files.map(file => delete_1.default(user, file.id)))
                        .then(() => {
                        folder.remove((removeErr) => {
                            if (removeErr !== null) {
                                return reject(removeErr);
                            }
                            resolve();
                        });
                    }, (fileDelErr) => {
                        reject(fileDelErr);
                    });
                });
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
