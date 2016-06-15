"use strict";
const search_1 = require('../../endpoints/posts/search');
function default_1(app, user, req, res) {
    search_1.default(user, req.payload['query'], req.payload['limit'], req.payload['since-id'], req.payload['max-id']).then(posts => {
        res(posts);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
