"use strict";
const accept_1 = require('../../../../endpoints/talks/group/invitations/accept');
function default_1(app, user, req, res) {
    const invitationId = req.payload['invitation-id'];
    accept_1.default(app, user, invitationId).then(() => {
        res({ kyoppie: 'yuppie' });
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
