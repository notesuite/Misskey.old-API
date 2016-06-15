"use strict";
const create_1 = require('../../../endpoints/talks/group/create');
function default_1(app, user, req, res) {
    const name = req.payload['name'];
    create_1.default(app, user, name).then(group => {
        res(group);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
