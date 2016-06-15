"use strict";
const rename_1 = require('../../../endpoints/album/tags/rename');
function default_1(app, user, req, res) {
    rename_1.default(user, req.payload['tag-id'], req.payload['name']).then(tag => {
        res(tag);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
