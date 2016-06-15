"use strict";
const find_by_tag_1 = require('../../../endpoints/album/files/find-by-tag');
function default_1(app, user, req, res) {
    find_by_tag_1.default(user, req.payload['tag-id'], req.payload['folder-id'], req.payload['limit'], req.payload['since-id'], req.payload['max-id']).then(files => {
        res(files);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
