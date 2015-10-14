import * as mongoose from 'mongoose';

const config: any = require('../config');

const db = mongoose.createConnection(config.mongo.uri, config.mongo.options);
const Schema = mongoose.Schema;

const schema: mongoose.Schema = new Schema({
	appId: { type: Schema.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	attacheds: { type: [Schema.Types.ObjectId], default: [] },
	inReplyToStatusId: { type: Schema.Types.ObjectId, default: null },
	isDeleted: { type: Boolean, required: false, default: false },
	text: { type: String, default: null },
	userId: { type: Schema.Types.ObjectId, required: true }
});

module.exports = db.model('Status', schema);
