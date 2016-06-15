"use strict";
const delete_1 = require('../../../endpoints/talks/messages/delete');
function default_1(app, user, req, res) {
    delete_1.default(user, req.payload['message-id']).then(() => {
        res({ status: 'success' });
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
