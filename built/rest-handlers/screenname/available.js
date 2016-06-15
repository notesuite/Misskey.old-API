"use strict";
const available_1 = require('../../endpoints/screenname/available');
function default_1(app, user, req, res) {
    available_1.default(req.payload['screen-name']).then(available => {
        res({
            available: available
        });
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
