"use strict";
const show_1 = require('../../../endpoints/album/folders/show');
function default_1(app, user, req, res) {
    show_1.default(user, req.payload['folder-id']).then(folder => {
        res(folder);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
