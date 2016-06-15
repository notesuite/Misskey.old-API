"use strict";
const list_1 = require('../../../endpoints/album/files/list');
function default_1(app, user, req, res) {
    list_1.default(user, req.payload['folder-id'], req.payload['limit'], req.payload['since-id'], req.payload['max-id']).then(files => {
        res(files);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
