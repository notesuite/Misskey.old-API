"use strict";
const search_1 = require('../../endpoints/hashtags/search');
function default_1(app, user, req, res) {
    search_1.default(req.payload['name']).then(hashtags => {
        res(hashtags);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
