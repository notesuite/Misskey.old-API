"use strict";
const login_1 = require('../endpoints/login');
function default_1(app, user, req, res, isOfficial) {
    const screenName = req.payload['screen-name'];
    const password = req.payload['password'];
    if (isOfficial) {
        login_1.default(screenName, password).then(loginer => {
            res(loginer);
        }, (err) => {
            res({ error: err }).code(500);
        });
    }
    else {
        res({ error: 'access-denied' }).code(403);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
