"use strict";
const db_1 = require('../../../db/db');
function default_1(user, parentFolderId, name = null) {
    if (name !== null && name.length > 100) {
        return Promise.reject('too-long-name');
    }
    return new Promise((resolve, reject) => {
        if (parentFolderId !== undefined && parentFolderId !== null) {
            db_1.AlbumFolder.findOne({
                _id: parentFolderId,
                user: user.id
            }, (folderFindErr, parent) => {
                if (folderFindErr !== null) {
                    reject(folderFindErr);
                }
                else if (parent === null) {
                    reject('folder-not-found');
                }
                else {
                    db_1.AlbumFolder.create({
                        user: user.id,
                        name: name,
                        color: '#57aee5',
                        parent: parent
                    }, (createErr, folder) => {
                        if (createErr !== null) {
                            return reject(createErr);
                        }
                        resolve(folder.toObject());
                    });
                }
            });
        }
        else {
            db_1.AlbumFolder.create({
                user: user.id,
                name: name,
                color: '#57aee5'
            }, (createErr, folder) => {
                if (createErr !== null) {
                    return reject(createErr);
                }
                resolve(folder.toObject());
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
