"use strict";
const reply_1 = require('../../endpoints/posts/reply');
function default_1(app, user, req, res) {
    reply_1.default(app, user, req.payload['in-reply-to-post-id'], req.payload['text'], req.payload['files']).then(post => {
        res(post);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
