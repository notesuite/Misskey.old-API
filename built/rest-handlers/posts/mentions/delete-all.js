"use strict";
const delete_all_1 = require('../../../endpoints/posts/mentions/delete-all');
function default_1(app, user, req, res) {
    delete_all_1.default(user).then(() => {
        res({
            'kyoppie': 'yuppie'
        });
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
