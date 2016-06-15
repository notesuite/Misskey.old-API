"use strict";
const delete_1 = require('../../../endpoints/album/tags/delete');
function default_1(app, user, req, res) {
    delete_1.default(user, req.payload['tag-id']).then(tag => {
        res(tag);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
