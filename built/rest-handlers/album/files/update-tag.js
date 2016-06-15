"use strict";
const update_tag_1 = require('../../../endpoints/album/files/update-tag');
function default_1(app, user, req, res) {
    update_tag_1.default(user, req.payload['file-id'], req.payload['tags']).then(file => {
        res(file);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
