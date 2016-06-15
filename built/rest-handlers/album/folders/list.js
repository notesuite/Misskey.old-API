"use strict";
const list_1 = require('../../../endpoints/album/folders/list');
function default_1(app, user, req, res) {
    list_1.default(user, req.payload['folder-id']).then(folders => {
        res(folders);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
