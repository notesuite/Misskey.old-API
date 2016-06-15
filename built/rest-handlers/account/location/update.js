"use strict";
const update_1 = require('../../../endpoints/account/location/update');
function default_1(app, user, req, res) {
    update_1.default(user, req.payload['location']).then(saved => {
        res(saved);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
