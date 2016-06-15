"use strict";
const mongoose_1 = require('mongoose');
function default_1(db) {
    const schema = new mongoose_1.Schema({
        createdAt: { type: Date, required: true, default: Date.now },
        userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        appKey: { type: String, required: true },
        callbackUrl: { type: String, required: false, default: null },
        description: { type: String, required: true },
        iconId: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null },
        permissions: { type: [String], required: true },
        isSuspended: { type: Boolean, required: false, default: false },
        idDeleted: { type: Boolean, required: false, default: false }
    });
    if (!schema.options.toObject) {
        schema.options.toObject = {};
    }
    schema.options.toObject.transform = (doc, ret) => {
        ret.id = doc.id;
        delete ret._id;
        delete ret.__v;
    };
    return db.model('Application', schema, 'Applications');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
