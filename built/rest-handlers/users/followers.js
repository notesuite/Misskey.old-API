"use strict";
const followers_1 = require('../../endpoints/users/followers');
function default_1(app, user, req, res) {
    followers_1.default(user, req.payload['user-id'], req.payload['limit'], req.payload['since-id'], req.payload['max-id']).then(followers => {
        res(followers);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
