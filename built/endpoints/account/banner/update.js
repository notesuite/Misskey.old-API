"use strict";
const db_1 = require('../../../db/db');
function default_1(user, fileId) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFile.findById(fileId, (findErr, file) => {
            if (findErr !== null) {
                return reject(findErr);
            }
            else if (file === null) {
                return reject('file-not-found');
            }
            else if (file.user.toString() !== user.id.toString()) {
                return reject('file-not-found');
            }
            else if (file.isDeleted) {
                return reject('file-not-found');
            }
            user.banner = file.id;
            user.bannerPath = file.serverPath;
            user.save((saveErr, saved) => {
                if (saveErr !== null) {
                    reject(saveErr);
                }
                else {
                    resolve(saved.toObject());
                }
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
