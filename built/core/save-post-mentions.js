"use strict";
const db_1 = require('../db/db');
const extract_mentions_1 = require('./extract-mentions');
const create_notification_1 = require('./create-notification');
function default_1(author, post, text) {
    extract_mentions_1.default(text).then(users => {
        users.forEach(user => {
            db_1.PostMention.create({
                user: user.id,
                post: post.id
            }, (createErr, createdMention) => {
                create_notification_1.default(null, user.id, 'mention', {
                    postId: post.id
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
