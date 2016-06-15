"use strict";
const powerful_1 = require('powerful');
const crypto = require('crypto');
const request = require('request');
const gm = require('gm');
const db_1 = require('../db/db');
const config_1 = require('../config');
function default_1(appId, userId, fileName, mimetype, file, size, folderId = null, unconditional = false) {
    const hash = crypto
        .createHash('sha256')
        .update(file)
        .digest('hex');
    return new Promise((resolve, reject) => {
        if (!unconditional) {
            db_1.AlbumFile.findOne({
                user: userId,
                isDeleted: false,
                hash: hash,
                dataSize: size
            }, (hashmuchFileFindErr, hashmuchFile) => {
                if (hashmuchFileFindErr !== null) {
                    console.error(hashmuchFileFindErr);
                    return reject('something-happend');
                }
                if (hashmuchFile === null) {
                    register();
                }
                else {
                    resolve(hashmuchFile);
                }
            });
        }
        else {
            register();
        }
        function register() {
            db_1.AlbumFile.find({ user: userId }, (albumFilesFindErr, albumFiles) => {
                if (albumFilesFindErr !== null) {
                    console.error(albumFilesFindErr);
                    return reject(albumFilesFindErr);
                }
                const used = albumFiles.map(albumFile => albumFile.dataSize).reduce((x, y) => x + y, 0);
                if (used + size > powerful_1.dataSize.fromMiB(1000)) {
                    return reject('no-free-space');
                }
                if (folderId !== null) {
                    db_1.AlbumFolder.findById(folderId, (folderFindErr, folder) => {
                        if (folderFindErr !== null) {
                            return reject(folderFindErr);
                        }
                        else if (folder === null) {
                            return reject('folder-not-found');
                        }
                        else if (folder.user.toString() !== userId) {
                            return reject('folder-not-found');
                        }
                        create(folder);
                    });
                }
                else {
                    create(null);
                }
                function create(folder = null) {
                    db_1.AlbumFile.create({
                        app: appId !== null ? appId : null,
                        user: userId,
                        folder: folder !== null ? folder.id : null,
                        dataSize: size,
                        mimeType: mimetype,
                        name: fileName,
                        serverPath: null,
                        hash: hash
                    }, (albumFileCreateErr, albumFile) => {
                        if (albumFileCreateErr !== null) {
                            console.error(albumFileCreateErr);
                            return reject(albumFileCreateErr);
                        }
                        request.post({
                            url: `http://${config_1.default.fileServer.ip}:${config_1.default.fileServer.port}/register`,
                            formData: {
                                'file-id': albumFile.id,
                                'passkey': config_1.default.fileServer.passkey,
                                file: {
                                    value: file,
                                    options: {
                                        filename: fileName
                                    }
                                }
                            }
                        }, (uploadErr, _, path) => {
                            if (uploadErr !== null) {
                                console.error(uploadErr);
                                return reject(uploadErr);
                            }
                            albumFile.serverPath = path;
                            if (/^image\/.*$/.test(mimetype)) {
                                gm(file, fileName)
                                    .size((getSizeErr, whsize) => {
                                    if (getSizeErr !== undefined && getSizeErr !== null) {
                                        console.error(getSizeErr);
                                        return save(albumFile);
                                    }
                                    albumFile.properties = {
                                        width: whsize.width,
                                        height: whsize.height
                                    };
                                    save(albumFile);
                                });
                            }
                            else {
                                save(albumFile);
                            }
                        });
                    });
                }
            });
        }
        function save(albumFile) {
            albumFile.save((saveErr, saved) => {
                if (saveErr !== null) {
                    console.error(saveErr);
                    return reject(saveErr);
                }
                resolve(saved);
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
