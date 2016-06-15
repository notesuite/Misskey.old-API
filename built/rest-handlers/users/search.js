"use strict";
const search_1 = require('../../endpoints/users/search');
function default_1(app, user, req, res) {
    search_1.default(user, req.payload['query'], req.payload['limit']).then(users => {
        res(users);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
