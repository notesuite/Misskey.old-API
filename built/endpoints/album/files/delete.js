"use strict";
const request = require('request');
const db_1 = require('../../../db/db');
const config_1 = require('../../../config');
function default_1(user, fileId) {
    return new Promise((resolve, reject) => {
        db_1.AlbumFile.findById(fileId, (findErr, file) => {
            if (findErr !== null) {
                reject(findErr);
            }
            else if (file === null) {
                reject('file-not-found');
            }
            else if (file.user.toString() !== user.id) {
                reject('file-not-found');
            }
            else {
                request.del({
                    url: `http://${config_1.default.fileServer.ip}:${config_1.default.fileServer.port}/delete`,
                    form: {
                        passkey: config_1.default.fileServer.passkey,
                        path: file.serverPath
                    }
                }, (err, _, res) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    file.isDeleted = true;
                    file.save((saveErr, saved) => {
                        if (saveErr !== null) {
                            return reject(saveErr);
                        }
                        resolve(saved.toObject());
                    });
                });
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
