"use strict";
const move_1 = require('../../../endpoints/album/folders/move');
function default_1(app, user, req, res) {
    move_1.default(user, req.payload['folder-id'], req.payload['destination-folder-id']).then(folder => {
        res(folder);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
