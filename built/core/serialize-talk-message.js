"use strict";
function default_1(message, me, includeGroup = false) {
    return new Promise((resolve, reject) => {
        switch (message.type) {
            case 'user-message':
                message
                    .populate({
                    path: 'user recipient',
                    model: 'User'
                })
                    .populate({
                    path: 'file',
                    model: 'AlbumFile'
                }, (err, message2) => {
                    if (err !== null) {
                        reject(err);
                    }
                    resolve(message2.toObject());
                });
                break;
            case 'group-message':
                const q = message
                    .populate({
                    path: 'user',
                    model: 'User'
                });
                if (includeGroup) {
                    q.populate({
                        path: 'group',
                        model: 'TalkGroup'
                    });
                }
                q.populate({
                    path: 'file',
                    model: 'AlbumFile'
                }, (err, message2) => {
                    if (err !== null) {
                        reject(err);
                    }
                    resolve(message2.toObject());
                });
                break;
            case 'group-send-invitation-activity':
                let q2 = message;
                if (includeGroup) {
                    q2 = message.populate({
                        path: 'group',
                        model: 'TalkGroup'
                    });
                }
                q2.populate({
                    path: 'invitee inviter',
                    model: 'User'
                }, (err, message2) => {
                    if (err !== null) {
                        reject(err);
                    }
                    resolve(message2.toObject());
                });
                break;
            case 'group-member-join-activity':
                let q3 = message;
                if (includeGroup) {
                    q3 = message.populate({
                        path: 'group',
                        model: 'TalkGroup'
                    });
                }
                q3.populate({
                    path: 'joiner',
                    model: 'User'
                }, (err, message2) => {
                    if (err !== null) {
                        reject(err);
                    }
                    resolve(message2.toObject());
                });
                break;
            default:
                break;
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
