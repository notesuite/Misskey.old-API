"use strict";
const request = require('request');
const db_1 = require('../../../db/db');
const album_file_1 = require('../../../spec/album-file');
const config_1 = require('../../../config');
function default_1(user, fileId, name) {
    if (!album_file_1.isName(name)) {
        return Promise.reject('invalid-file-name');
    }
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
                request.put({
                    url: `http://${config_1.default.fileServer.ip}:${config_1.default.fileServer.port}/rename`,
                    form: {
                        passkey: config_1.default.fileServer.passkey,
                        'old-path': file.serverPath,
                        'new-name': name
                    }
                }, (err, _, path) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    file.name = name;
                    file.serverPath = path;
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
