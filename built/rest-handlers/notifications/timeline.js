"use strict";
const timeline_1 = require('../../endpoints/notifications/timeline');
function default_1(app, user, req, res) {
    timeline_1.default(user, req.payload['limit'], req.payload['since-id'], req.payload['max-id']).then(timeline => {
        res(timeline);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
