"use strict";
const powerful_1 = require('powerful');
const like_1 = require('../../endpoints/posts/like');
function default_1(app, user, req, res) {
    like_1.default(user, req.payload['post-id']).then(() => {
        res({ kyoppie: "yuppie" });
    }, (err) => {
        const statusCode = new powerful_1.Match(err)
            .is('post-not-found', () => 404)
            .is('post-deleted', () => 410)
            .is('already-liked', () => 400)
            .getValue(500);
        res({ error: err }).code(statusCode);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
