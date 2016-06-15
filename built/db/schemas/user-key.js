"use strict";
const mongoose_1 = require('mongoose');
function default_1(db) {
    const schema = new mongoose_1.Schema({
        app: { type: mongoose_1.Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
        key: { type: String, required: true, unique: true },
        user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
    });
    return db.model('UserKey', schema, 'UserKeys');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
