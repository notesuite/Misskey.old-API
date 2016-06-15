"use strict";
const db_1 = require('./db/db');
const config_1 = require('./config');
function default_1(req) {
    return new Promise((resolve, reject) => {
        if (req.headers['passkey'] === undefined || req.headers['passkey'] === null) {
            resolve({ app: null, user: null, isOfficial: false });
        }
        else if (req.headers['passkey'] !== config_1.default.apiPasskey) {
            reject();
        }
        else if (req.headers['user-id'] === undefined || req.headers['user-id'] === null || req.headers['user-id'] === 'null') {
            resolve({ app: null, user: null, isOfficial: true });
        }
        else {
            db_1.User.findById(req.headers['user-id'], (err, user) => {
                resolve({
                    app: null,
                    user: user,
                    isOfficial: true
                });
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
