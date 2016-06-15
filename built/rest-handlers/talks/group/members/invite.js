"use strict";
const invite_1 = require('../../../../endpoints/talks/group/members/invite');
function default_1(app, user, req, res) {
    const groupId = req.payload['group-id'];
    const userId = req.payload['user-id'];
    const text = req.payload['text'];
    invite_1.default(app, user, groupId, userId, text).then(group => {
        res(group);
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
