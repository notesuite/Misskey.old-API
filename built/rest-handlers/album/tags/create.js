"use strict";
const create_1 = require('../../../endpoints/album/tags/create');
function default_1(app, user, req, res) {
    create_1.default(user, req.payload['name'], req.payload['color']).then(tag => {
        res(tag);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
