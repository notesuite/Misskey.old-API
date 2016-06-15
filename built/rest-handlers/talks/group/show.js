"use strict";
const show_1 = require('../../../endpoints/talks/group/show');
function default_1(app, user, req, res) {
    const groupId = req.payload['group-id'];
    show_1.default(user, groupId).then(group => {
        res(group);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
