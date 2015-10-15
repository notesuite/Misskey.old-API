import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const config: any = require('../config');

const schema: mongoose.Schema = new Schema({
	name: { type: String, required: true },
	userId: { type: Schema.Types.ObjectId, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	appKey: { type: String, required: true, unique: true },
	callbackUrl: { type: String, required: false, default: null },
	description: { type: String, required: true },
	isDeleted: { type: Boolean, required: false, default: false },
	isSuspended: { type: Boolean, required: false, default: false },
	iconId: { type: Schema.Types.ObjectId, required: false, default: null },
	permissions: { type: [String], required: false, default: [] }
});

schema.virtual('iconUrl').get(() => `${config.imageServerUrl}/${this.icon}`);
