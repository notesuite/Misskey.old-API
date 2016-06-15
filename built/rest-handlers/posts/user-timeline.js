"use strict";
const user_timeline_1 = require('../../endpoints/posts/user-timeline');
function default_1(app, user, req, res) {
    user_timeline_1.default(user, req.payload['user-id'], req.payload['types'], req.payload['limit'], req.payload['since-id'], req.payload['max-id'])
        .then(timeline => {
        res(timeline);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
