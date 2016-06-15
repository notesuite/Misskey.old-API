"use strict";
const create_1 = require('../../../endpoints/bbs/topics/create');
function default_1(app, user, req, res) {
    const title = req.payload['title'];
    create_1.default(app, user, title).then(topic => {
        res(topic);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
