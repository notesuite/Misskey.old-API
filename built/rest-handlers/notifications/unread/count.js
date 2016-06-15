"use strict";
const count_1 = require('../../../endpoints/notifications/unread/count');
function default_1(app, user, req, res) {
    count_1.default(user).then(count => {
        res(count);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
