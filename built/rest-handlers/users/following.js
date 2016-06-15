"use strict";
const following_1 = require('../../endpoints/users/following');
function default_1(app, user, req, res) {
    following_1.default(user, req.payload['user-id'], req.payload['limit'], req.payload['since-id'], req.payload['max-id']).then(following => {
        res(following);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
