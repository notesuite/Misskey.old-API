"use strict";
const list_1 = require('../../../endpoints/album/tags/list');
function default_1(app, user, req, res) {
    list_1.default(user).then(tags => {
        res(tags);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
