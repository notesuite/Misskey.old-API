"use strict";
const rename_1 = require('../../../endpoints/album/files/rename');
function default_1(app, user, req, res) {
    rename_1.default(user, req.payload['file-id'], req.payload['name']).then(file => {
        res(file);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
