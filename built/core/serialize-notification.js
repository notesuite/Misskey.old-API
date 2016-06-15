"use strict";
const db_1 = require('../db/db');
const serialize_post_1 = require('../core/serialize-post');
const serialize_talk_message_1 = require('../core/serialize-talk-message');
function default_1(notification, me) {
    const type = notification.type;
    const content = notification.content;
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'like':
            case 'repost':
                db_1.User.findById(content.userId, (userErr, user) => {
                    db_1.Post.findById(content.postId, (postErr, post) => {
                        notification.content.user = user.toObject();
                        notification.content.post = post.toObject();
                        resolve(notification);
                    });
                });
                break;
            case 'mention':
                db_1.Post.findById(content.postId, (postErr, post) => {
                    serialize_post_1.default(post, me).then((post2) => {
                        notification.content.post = post2;
                        resolve(notification);
                    }, reject);
                });
                break;
            case 'follow':
                db_1.User.findById(content.userId, (userErr, user) => {
                    notification.content.user = user.toObject();
                    resolve(notification);
                });
                break;
            case 'talk-user-message':
                db_1.TalkUserMessage.findById(content.messageId, (messageErr, message) => {
                    serialize_talk_message_1.default(message, me).then((message2) => {
                        notification.content.message = message2;
                        resolve(notification);
                    }, reject);
                });
                break;
            default:
                reject('unknown-notification-type');
                break;
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
