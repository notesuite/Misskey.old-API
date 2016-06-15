"use strict";
const add_file_to_album_1 = require('../../../core/add-file-to-album');
const album_file_1 = require('../../../spec/album-file');
function default_1(app, user, fileName, mimetype, file, size, folderId = null, unconditional = false) {
    if (!album_file_1.isName(fileName)) {
        return Promise.reject('invalid-file-name');
    }
    return new Promise((resolve, reject) => {
        if (user === undefined || user === null) {
            return reject('plz-authenticate');
        }
        else if (user.isSuspended) {
            return reject('access-denied');
        }
        const appId = app !== null ? app.id : null;
        add_file_to_album_1.default(appId, user.id, fileName, mimetype, file, size, folderId, unconditional).then(createdFile => {
            resolve(createdFile.toObject());
        }, (err) => {
            reject(err);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
