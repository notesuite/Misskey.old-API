"use strict";
const mongoose_1 = require('mongoose');
const config_1 = require('../../config');
function default_1(db) {
    const schema = new mongoose_1.Schema({
        app: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
        createdAt: { type: Date, required: true, default: Date.now },
        dataSize: { type: Number, required: true },
        folder: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFolder' },
        mimeType: { type: String, required: true },
        hash: { type: String, required: false, default: null },
        isDeleted: { type: Boolean, required: false, default: false },
        isHidden: { type: Boolean, required: false, default: false },
        isPrivate: { type: Boolean, required: false, default: false },
        name: { type: String, required: true },
        properties: { type: mongoose_1.Schema.Types.Mixed, required: false, default: null },
        serverPath: { type: String, required: false },
        tags: [{ type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumTag' }],
        user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
    });
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = (doc, ret) => {
        ret.id = doc.id;
        ret.url = `${config_1.default.fileServer.url}/${doc.serverPath.split('/').map(encodeURI).join('/')}`;
        ret.thumbnailUrl = `${ret.url}?thumbnail`;
        delete ret._id;
        delete ret.__v;
        delete ret.serverPath;
    };
    return db.model('AlbumFile', schema, 'AlbumFiles');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
