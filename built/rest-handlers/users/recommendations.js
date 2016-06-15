"use strict";
const recommendations_1 = require('../../endpoints/users/recommendations');
function default_1(app, user, req, res) {
    recommendations_1.default(user, req.payload['limit']).then(recommendationUsers => {
        res(recommendationUsers);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
