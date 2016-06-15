"use strict";
const show_1 = require('../../../endpoints/posts/likes/show');
function default_1(app, user, req, res) {
    show_1.default(user, req.payload['post-id'], req.payload['limit'], req.payload['since-id'], req.payload['max-id']).then(posts => {
        res(posts);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
