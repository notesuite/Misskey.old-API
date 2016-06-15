"use strict";
const redis = require('redis');
const db_1 = require('./db/db');
const config_1 = require('./config');
class MisskeyEvent {
    constructor() {
        this.redisConnection = redis.createClient(config_1.default.redis.port, config_1.default.redis.host, {
            auth_pass: config_1.default.redis.password
        });
    }
    publishPost(userId, post) {
        const postObj = JSON.stringify({
            type: 'post',
            value: {
                id: post.id
            }
        });
        this.publish(`user-stream:${userId}`, postObj);
        db_1.UserFollowing.find({ followee: userId }, (_, followers) => {
            followers.forEach(follower => {
                this.publish(`user-stream:${follower.follower}`, postObj);
            });
        });
    }
    publishNotification(notification) {
        this.publish(`user-stream:${notification.user}`, JSON.stringify({
            type: 'notification',
            value: notification.toObject()
        }));
    }
    publishReadTalkUserMessage(otherpartyId, meId, message) {
        this.publish(`talk-user-stream:${otherpartyId}-${meId}`, JSON.stringify({
            type: 'read',
            value: message.id
        }));
    }
    publishDeleteTalkUserMessage(meId, otherpartyId, message) {
        this.publish(`talk-user-stream:${otherpartyId}-${meId}`, JSON.stringify({
            type: 'otherparty-message-delete',
            value: message.id
        }));
        this.publish(`talk-user-stream:${meId}-${otherpartyId}`, JSON.stringify({
            type: 'me-message-delete',
            value: message.id
        }));
    }
    publishReadTalkGroupMessage(groupId, message) {
        this.publish(`talk-group-stream:${groupId}`, JSON.stringify({
            type: 'read',
            value: message.id
        }));
    }
    publishDeleteTalkGroupMessage(groupId, message) {
        this.publish(`talk-group-stream:${groupId}`, JSON.stringify({
            type: 'delete-message',
            value: message.id
        }));
    }
    publishUserTalkMessage(meId, recipientId, message) {
        [
            [`user-stream:${recipientId}`, 'talk-user-message'],
            [`talk-user-stream:${recipientId}-${meId}`, 'message'],
            [`talk-user-stream:${meId}-${recipientId}`, 'message']
        ].forEach(([channel, type]) => {
            this.publish(channel, JSON.stringify({
                type: type,
                value: {
                    id: message.id,
                    userId: meId,
                    text: message.text
                }
            }));
        });
    }
    publishGroupTalkMessage(message, group) {
        group.members.map(member => [`user-stream:${member}`, 'talk-user-message']).concat([
            [`talk-group-stream:${group.id}`, 'message']
        ]).forEach(([channel, type]) => {
            this.publish(channel, JSON.stringify({
                type: type,
                value: {
                    id: message.id
                }
            }));
        });
    }
    publish(channel, message) {
        this.redisConnection.publish(`misskey:${channel}`, message);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new MisskeyEvent();
