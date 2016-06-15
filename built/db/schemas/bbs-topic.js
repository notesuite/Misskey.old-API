"use strict";
const mongoose_1 = require('mongoose');
function default_1(db) {
    const schema = new mongoose_1.Schema({
        bookmarksCount: { type: Number, required: false, default: 0 },
        createdAt: { type: Date, required: true, default: Date.now },
        pinnedPost: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'BBSPost' },
        title: { type: String, required: true },
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
    return db.model('BBSTopic', schema, 'BBSTopics');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
