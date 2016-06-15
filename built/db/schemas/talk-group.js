"use strict";
const mongoose_1 = require('mongoose');
const config_1 = require('../../config');
function default_1(db) {
    const schema = new mongoose_1.Schema({
        allowInvite: { type: Boolean, required: false, default: true },
        createdAt: { type: Date, required: true, default: Date.now },
        icon: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
        iconPath: { type: String, required: false, default: null },
        members: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }],
        name: { type: String, required: true },
        owner: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
    });
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
        delete ret.icon;
        delete ret.iconPath;
        ret.iconUrl = doc.icon !== null
            ? `${config_1.default.fileServer.url}/${encodePath(doc.iconPath)}`
            : `${config_1.default.fileServer.url}/defaults/talk-group-icon.jpg`;
        ret.iconThumbnailUrl = `${ret.iconUrl}?thumbnail`;
    };
    return db.model('TalkGroup', schema, 'TalkGroups');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function encodePath(path) {
    return path.split('/').map(encodeURI).join('/');
}
