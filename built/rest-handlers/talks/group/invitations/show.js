"use strict";
const show_1 = require('../../../../endpoints/talks/group/invitations/show');
function default_1(app, user, req, res) {
    show_1.default(app, user).then(invitations => {
        res(invitations);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
