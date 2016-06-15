"use strict";
const mongoose = require('mongoose');
const mongoose_1 = require('mongoose');
const base = {
    updatedAt: { type: Date, required: true, default: Date.now },
    message: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'TalkMessage' },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
};
function talkHistory(db) {
    const schema = new mongoose_1.Schema(Object.assign({
        type: { type: String, required: true }
    }, base));
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
    };
    return db.model('TalkHistory', schema, 'TalkHistories');
}
exports.talkHistory = talkHistory;
function talkUserHistory(db) {
    const deepPopulate = require('mongoose-deep-populate')(mongoose);
    const schema = new mongoose_1.Schema(Object.assign({
        recipient: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
        type: { type: String, required: false, default: 'user' }
    }, base));
    schema.plugin(deepPopulate);
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
    };
    return db.model('TalkUserHistory', schema, 'TalkHistories');
}
exports.talkUserHistory = talkUserHistory;
function talkGroupHistory(db) {
    const deepPopulate = require('mongoose-deep-populate')(mongoose);
    const schema = new mongoose_1.Schema(Object.assign({
        group: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
        type: { type: String, required: false, default: 'group' }
    }, base));
    schema.plugin(deepPopulate);
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
    };
    return db.model('TalkGroupHistory', schema, 'TalkHistories');
}
exports.talkGroupHistory = talkGroupHistory;
