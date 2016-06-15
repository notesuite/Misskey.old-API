"use strict";
const create_1 = require('../../endpoints/posts/create');
function default_1(app, user, req, res) {
    create_1.default(app, user, req.payload['text'], req.payload['files']).then(post => {
        res(post);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
