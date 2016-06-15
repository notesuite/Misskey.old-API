"use strict";
const remove_tag_1 = require('../../../endpoints/album/files/remove-tag');
function default_1(app, user, req, res) {
    remove_tag_1.default(user, req.payload['file-id'], req.payload['tag-id']).then(file => {
        res(file);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
