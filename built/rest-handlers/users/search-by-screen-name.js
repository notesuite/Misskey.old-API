"use strict";
const search_by_screen_name_1 = require('../../endpoints/users/search-by-screen-name');
function default_1(app, user, req, res) {
    search_by_screen_name_1.default(user, req.payload['screen-name']).then(users => {
        res(users);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
