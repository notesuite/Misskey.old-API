"use strict";
const show_1 = require('../../endpoints/notifications/show');
function default_1(app, user, req, res) {
    show_1.default(user, req.payload['notification-id']).then(notification => {
        res(notification);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
