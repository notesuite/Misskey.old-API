"use strict";
const move_1 = require('../../../endpoints/album/files/move');
function default_1(app, user, req, res) {
    let folderId = req.payload['folder-id'];
    if (folderId === 'null') {
        folderId = null;
    }
    move_1.default(user, req.payload['file-id'], folderId).then(file => {
        res(file);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
