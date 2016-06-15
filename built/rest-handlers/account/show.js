"use strict";
const show_1 = require('../../endpoints/account/show');
function default_1(app, user, req, res) {
    res(show_1.default(user));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
