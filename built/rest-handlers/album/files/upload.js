"use strict";
const fs = require('fs');
const upload_1 = require('../../../endpoints/album/files/upload');
function default_1(app, user, req, res) {
    const file = req.payload.file;
    if (file === undefined || file === null) {
        res('empty-file').code(400);
        return;
    }
    const unconditional = req.payload.unconditional;
    let folder = req.payload['folder-id'];
    if (folder === 'null') {
        folder = null;
    }
    const path = file.path;
    const fileName = file.filename;
    const mimetype = file.headers['content-type'];
    const fileBuffer = fs.readFileSync(path);
    const size = file.bytes;
    fs.unlink(path);
    upload_1.default(app, user, fileName, mimetype, fileBuffer, size, folder, unconditional).then(albumFile => {
        res(albumFile);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
