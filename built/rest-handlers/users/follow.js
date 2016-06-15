"use strict";
const follow_1 = require('../../endpoints/users/follow');
function default_1(app, user, req, res) {
    if (req.payload['user-id'] === undefined || req.payload['user-id'] === null) {
        res('user-id-is-empty').code(400);
    }
    else {
        follow_1.default(user, req.payload['user-id']).then(() => {
            res({ kyoppie: 'yuppie' });
        }, (err) => {
            res({ error: err }).code(500);
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
