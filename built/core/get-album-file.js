"use strict";
const db_1 = require('../db/db');
function default_1(meId, fileId) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFile.findById(fileId, (findErr, file) => {
            if (findErr !== null) {
                reject(findErr);
            }
            else if (file === null) {
                reject('file-not-found');
            }
            else if (file.user.toString() !== meId.toString()) {
                reject('file-not-found');
            }
            else if (file.isDeleted) {
                reject('file-not-found');
            }
            else {
                resolve(file);
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
