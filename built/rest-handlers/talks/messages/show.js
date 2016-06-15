"use strict";
const show_1 = require('../../../endpoints/talks/messages/show');
function default_1(app, user, req, res) {
    show_1.default(user, req.payload['message-id']).then(message => {
        res(message);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
