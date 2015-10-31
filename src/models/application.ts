import * as mongoose from 'mongoose';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

const schema: mongoose.Schema = new Schema({
	createdAt: { type: Date, required: true, default: Date.now },
	userId: { type: Schema.Types.ObjectId, required: true },
	appKey: { type: String, required: true },
	callbackUrl: { type: String, required: false, default: null },
	description:  { type: String, required: true },
	iconId: { type: Schema.Types.ObjectId, required: false, default: null },
	permissions: { type: [String], required: true },
	isSuspended: { type: Boolean, required: false, default: false },
	idDeleted: { type: Boolean, required: false, default: false }
});

// schema.virtual('iconUrl').get(() => `${config.imageServerUrl}/${this.icon}`);

export const Application: mongoose.Model<mongoose.Document> = db.model('Application', schema);
