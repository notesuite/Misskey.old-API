"use strict";
const db_1 = require('../../../db/db');
function default_1(user, folderId) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFolder.findById(folderId, (findErr, folder) => {
            if (findErr !== null) {
                reject(findErr);
            }
            else if (folder === null) {
                reject('folder-not-found');
            }
            else if (folder.user.toString() !== user.id) {
                reject('folder-not-found');
            }
            else {
                let folderObj = folder.toObject();
                if (folder.parent === null) {
                    resolve(folderObj);
                }
                else {
                    get(folder.parent).then((parent) => {
                        folderObj.parent = parent;
                        resolve(folderObj);
                    });
                }
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function get(id) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFolder.findById(id, (err, folder) => {
            if (err !== null) {
                reject(err);
            }
            else if (folder.parent === null) {
                resolve(folder.toObject());
            }
            else {
                get(folder.parent).then(parent => {
                    let folderObj = folder.toObject();
                    folderObj.parent = parent;
                    resolve(folderObj);
                }, (getErr) => {
                    reject(getErr);
                });
            }
        });
    });
}
