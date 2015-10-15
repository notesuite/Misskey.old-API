import * as mongoose from 'mongoose';
// import * as mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');

const config: any = require('../config');

// Grobal option
const modelName: string = 'UserStorageFile';

// Mongo settings
const Schema: typeof mongoose.Schema = mongoose.Schema;
const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

// Declare scheme
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

// AutoIncrement
schema.plugin(mongooseAutoIncrement.plugin, {
	model: modelName,
	field: 'cursor'
});

// Export model
module.exports = db.model(modelName, schema);