"use strict";
const show_1 = require('../../../endpoints/hashtags/trend/show');
function default_1(app, user, req, res) {
    show_1.default().then(hashtags => {
        res(hashtags);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
