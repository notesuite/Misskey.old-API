"use strict";
const mongoose_1 = require('mongoose');
function default_1(db) {
    const schema = new mongoose_1.Schema({
        app: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
        files: [{ type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' }],
        createdAt: { type: Date, required: true, default: Date.now },
        inReplyToPost: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'BBSPost' },
        isContentModified: { type: Boolean, required: false, default: false },
        isDeleted: { type: Boolean, required: false, default: false },
        isPlain: { type: Boolean, required: false, default: false },
        likesCount: { type: Number, required: false, default: 0 },
        number: { type: Number, required: true },
        repliesCount: { type: Number, required: false, default: 0 },
        text: { type: String, required: true },
        topic: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'BBSTopic' },
        user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
    });
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
    };
    return db.model('BBSPost', schema, 'BBSPosts');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
