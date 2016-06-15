"use strict";
const recolor_1 = require('../../../endpoints/album/tags/recolor');
function default_1(app, user, req, res) {
    recolor_1.default(user, req.payload['tag-id'], req.payload['color']).then(tag => {
        res(tag);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
