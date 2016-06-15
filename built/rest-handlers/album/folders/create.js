"use strict";
const create_1 = require('../../../endpoints/album/folders/create');
function default_1(app, user, req, res) {
    create_1.default(user, req.payload['parent-folder-id'], req.payload['name']).then(folder => {
        res(folder);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
