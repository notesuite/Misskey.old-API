"use strict";
const rename_1 = require('../../../endpoints/album/folders/rename');
function default_1(app, user, req, res) {
    rename_1.default(user, req.payload['folder-id'], req.payload['name']).then(folder => {
        res(folder);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
