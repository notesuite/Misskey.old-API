"use strict";
const decline_1 = require('../../../../endpoints/talks/group/invitations/decline');
function default_1(app, user, req, res) {
    const invitationId = req.payload['invitation-id'];
    decline_1.default(app, user, invitationId).then(() => {
        res({ kyoppie: 'yuppie' });
    }, (err) => {
        res({ error: err }).code(500);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
