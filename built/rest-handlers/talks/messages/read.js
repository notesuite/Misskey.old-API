"use strict";
const read_1 = require('../../../endpoints/talks/messages/read');
function default_1(app, user, req, res) {
    read_1.default(user, req.payload['message-id']).then(() => {
        res({ status: 'success' });
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
