"use strict";
const show_1 = require('../../endpoints/users/show');
function default_1(app, user, req, res) {
    show_1.default(user, req.payload['user-id'], req.payload['screen-name']).then(showee => {
        res(showee);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
