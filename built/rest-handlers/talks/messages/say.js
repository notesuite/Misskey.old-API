"use strict";
const say_1 = require('../../../endpoints/talks/messages/say');
function default_1(app, user, req, res) {
    const userId = req.payload['user-id'];
    const groupId = req.payload['group-id'];
    const text = req.payload['text'];
    const fileId = req.payload['file'];
    say_1.default(app, user, text, fileId, userId, groupId).then(message => {
        res(message);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
