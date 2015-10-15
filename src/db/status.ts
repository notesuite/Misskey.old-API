import * as mongoose from 'mongoose';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
const config: any = require('../config');

// Grobal option
const modelName: string = 'Status';

// Mongo settings
const Schema: typeof mongoose.Schema = mongoose.Schema;
const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

const schema: mongoose.Schema = new Schema({
	appId: { type: Schema.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	attachedFileIds: { type: [Schema.Types.ObjectId], default: [] },
	inReplyToStatusId: { type: Schema.Types.ObjectId, default: null },
	isDeleted: { type: Boolean, required: false, default: false },
	text: { type: String, default: null },
	userId: { type: Schema.Types.ObjectId, required: true }
});

schema.plugin(mongooseAutoIncrement.plugin, {
	model: modelName,
	field: 'cursor'
});

export default db.model(modelName, schema);
