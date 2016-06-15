"use strict";
const stream_1 = require('../../../endpoints/talks/messages/stream');
function default_1(app, user, req, res) {
    stream_1.default(user, req.payload['limit'], req.payload['since-id'], req.payload['max-id'], req.payload['user-id'], req.payload['group-id']).then(stream => {
        res(stream);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
