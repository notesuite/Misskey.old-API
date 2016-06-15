"use strict";
const db_1 = require('../db/db');
function default_1(me, post) {
    db_1.PostMention.findOne({
        user: me.id,
        post: post.id
    }, (mentionFindErr, mention) => {
        if (mentionFindErr !== null) {
            return;
        }
        else if (mention === null) {
            return;
        }
        mention.isRead = true;
        mention.save();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
