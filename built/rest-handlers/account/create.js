"use strict";
const powerful_1 = require('powerful');
const create_1 = require('../../endpoints/account/create');
function default_1(app, user, req, res, isOfficial) {
    create_1.default(isOfficial, req.payload['screen-name'], req.payload['password']).then(created => {
        res({
            user: created.toObject()
        });
    }, (err) => {
        const statusCode = new powerful_1.Match(err)
            .is('empty-screen-name', () => 400)
            .is('invalid-screen-name', () => 400)
            .is('empty-password', () => 400)
            .getValue(500);
        res({ error: err }).code(statusCode);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
