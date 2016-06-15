"use strict";
const mongoose_1 = require('mongoose');
const base = {
    app: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
    createdAt: { type: Date, required: true, default: Date.now },
    isDeleted: { type: Boolean, required: false, default: false },
    nextPost: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
    prevPost: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
};
const generalBase = Object.assign({
    channel: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Channel' },
    likesCount: { type: Number, required: false, default: 0 },
    repliesCount: { type: Number, required: false, default: 0 },
    repostsCount: { type: Number, required: false, default: 0 },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
}, base);
const toObject = (doc, ret) => {
    ret.id = doc.id;
    ret.userId = ret.user;
    delete ret._id;
    delete ret.__v;
    switch (doc.type) {
        case 'status':
            break;
        case 'reply':
            ret.userId = ret.user;
            ret.inReplyToPostId = ret.inReplyToPost;
            break;
        default:
            break;
    }
};
function initSchema(db, schema) {
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
}
function post(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        type: { type: String, required: true }
    }, generalBase));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = toObject;
    return db.model('Post', schema, 'Posts');
}
exports.post = post;
function status(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        files: { type: [mongoose_1.Schema.Types.ObjectId], required: false, default: null, ref: 'AlbumFile' },
        hashtags: { type: [String], required: false, default: [] },
        text: { type: String, required: false, default: null },
        type: { type: String, required: true, default: 'status' }
    }, generalBase));
    initSchema(db, schema);
    return db.model('Status', schema, 'Posts');
}
exports.status = status;
function reply(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        files: { type: [mongoose_1.Schema.Types.ObjectId], required: false, default: null, ref: 'AlbumFile' },
        hashtags: { type: [String], required: false, default: [] },
        inReplyToPost: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
        text: { type: String, required: false, default: null },
        type: { type: String, required: true, default: 'reply' }
    }, generalBase));
    initSchema(db, schema);
    return db.model('Reply', schema, 'Posts');
}
exports.reply = reply;
function repost(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        post: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Post' },
        type: { type: String, required: true, default: 'repost' }
    }, base));
    initSchema(db, schema);
    return db.model('Repost', schema, 'Posts');
}
exports.repost = repost;
