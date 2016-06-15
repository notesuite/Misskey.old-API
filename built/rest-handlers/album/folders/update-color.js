"use strict";
const update_color_1 = require('../../../endpoints/album/folders/update-color');
function default_1(app, user, req, res) {
    update_color_1.default(user, req.payload['folder-id'], req.payload['color']).then(folder => {
        res(folder);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
