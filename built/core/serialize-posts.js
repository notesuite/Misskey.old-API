"use strict";
const serialize_post_1 = require('./serialize-post');
function default_1(posts, me = null) {
    return Promise.all(posts.map(post => serialize_post_1.default(post, me)));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
