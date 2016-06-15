"use strict";
const mongoose_1 = require('mongoose');
const base = {
    createdAt: { type: Date, required: true, default: Date.now }
};
const groupBaseScema = Object.assign({
    group: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
    reads: [{ type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'User' }]
}, base);
const toObject = (doc, ret) => {
    ret.id = doc.id;
    delete ret._id;
    delete ret.__v;
    switch (doc.type) {
        case 'user-message':
            ret.isModified = doc._doc.isContentModified;
            delete ret.isContentModified;
            break;
        case 'group-message':
            ret.isModified = doc._doc.isContentModified;
            delete ret.isContentModified;
            break;
        default:
            break;
    }
};
function message(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        type: { type: String, required: true }
    }, base));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkMessage', schema, 'TalkMessages');
}
exports.message = message;
function userMessage(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        file: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
        isContentModified: { type: Boolean, required: false, default: false },
        isDeleted: { type: Boolean, required: false, default: false },
        isRead: { type: Boolean, required: false, default: false },
        recipient: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        text: { type: String, required: false, default: '' },
        type: { type: String, required: false, default: 'user-message' },
        user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
    }, base));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkUserMessage', schema, 'TalkMessages');
}
exports.userMessage = userMessage;
function groupMessageBase(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        type: { type: String, required: true }
    }, groupBaseScema));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkGroupBase', schema, 'TalkMessages');
}
exports.groupMessageBase = groupMessageBase;
function groupMessage(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        file: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
        isContentModified: { type: Boolean, required: false, default: false },
        isDeleted: { type: Boolean, required: false, default: false },
        text: { type: String, required: false, default: '' },
        type: { type: String, required: false, default: 'group-message' },
        user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
    }, groupBaseScema));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkGroupMessage', schema, 'TalkMessages');
}
exports.groupMessage = groupMessage;
function groupSendInvitationActivity(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        invitee: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        inviter: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        invitation: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'TalkGroupInvitation' },
        type: { type: String, required: false, default: 'group-send-invitation-activity' }
    }, groupBaseScema));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkGroupSendInvitationActivity', schema, 'TalkMessages');
}
exports.groupSendInvitationActivity = groupSendInvitationActivity;
function groupMemberJoinActivity(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        joiner: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        type: { type: String, required: false, default: 'group-member-join-activity' }
    }, groupBaseScema));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkGroupMemberJoinActivity', schema, 'TalkMessages');
}
exports.groupMemberJoinActivity = groupMemberJoinActivity;
function groupMemberLeftActivity(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        lefter: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        type: { type: String, required: false, default: 'group-member-left-activity' }
    }, groupBaseScema));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkGroupMemberLeftActivity', schema, 'TalkMessages');
}
exports.groupMemberLeftActivity = groupMemberLeftActivity;
function renameGroupActivity(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        renamer: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        oldName: { type: String, required: true },
        newName: { type: String, required: true },
        type: { type: String, required: false, default: 'rename-group-activity' }
    }, groupBaseScema));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkRenameGroupActivity', schema, 'TalkMessages');
}
exports.renameGroupActivity = renameGroupActivity;
function transferGroupOwnershipActivity(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        oldOwner: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        newOwner: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        type: { type: String, required: false, default: 'transfer-group-ownership-activity' }
    }, groupBaseScema));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('TalkTransferGroupOwnershipActivity', schema, 'TalkMessages');
}
exports.transferGroupOwnershipActivity = transferGroupOwnershipActivity;
