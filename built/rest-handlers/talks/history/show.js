"use strict";
const show_1 = require('../../../endpoints/talks/history/show');
function default_1(app, user, req, res) {
    const type = req.payload['type'];
    const limit = req.payload['limit'];
    show_1.default(user, type, limit).then(messages => {
        res(messages);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
