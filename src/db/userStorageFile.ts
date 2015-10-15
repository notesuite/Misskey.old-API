import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');

const schema: mongoose.Schema = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	folderId: { type: Schema.Types.ObjectId, required: false, default: null },
	cursor: { type: Number },
	dataSize: { type: Number, required: true },
	serverPath: { type: String, required: true },
	properties: { type: Schema.Types.Mixed, required: false, default: {} },
	name: { type: String, required: true },
	tags: { type: [String], default: [] },
	hash: { type: String, required: true },
	format: { type: String, required: true },
	isDeleted: { type: Boolean, required: false, default: false }
});

schema.plugin(mongooseAutoIncrement.plugin, {
	model: 'UserStorageFile',
	field: 'cursor'
});
