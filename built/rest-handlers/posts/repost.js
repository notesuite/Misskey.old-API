"use strict";
const repost_1 = require('../../endpoints/posts/repost');
function default_1(app, user, req, res) {
    repost_1.default(app, user, req.payload['post-id']).then(repost => {
        res(repost);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
