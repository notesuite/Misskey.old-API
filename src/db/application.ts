import * as mongoose from 'mongoose';
const config: any = require('../config');

const modelName: string = 'Application';

// Mongo settings
const Schema: typeof mongoose.Schema = mongoose.Schema;
const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

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

// Declare iconUrl virtual property
schema.virtual('iconUrl').get(() => {
	return config.imageServerUrl + "/" + this.icon;
});

export default db.model(modelName, schema);
