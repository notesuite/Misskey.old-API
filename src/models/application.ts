import * as mongoose from 'mongoose';

const config: any = require('../config');

const db = mongoose.createConnection(config.mongo.uri, config.mongo.options);
const Schema = mongoose.Schema;
const schema: mongoose.Schema = new Schema({
	name: {
		type: String,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	appKey: {
		type: String,
		required: true,
		unique: true
	},
	callbackUrl: {
		type: String,
		required: false,
		default: null
	},
	description: {
		type: String,
		required: true
	},
	developerName: {
		type: String,
		required: false,
		default: null
	},
	developerWebsite: {
		type: String,
		required: false,
		default: null
	},
	isDeleted: {
		type: Boolean,
		required: false,
		default: false
	},
	isSuspended: {
		type: Boolean,
		required: false,
		default: false
	},
	icon: {
		type: Schema.Types.ObjectId,
		required: false,
		default: null
	},
	permissions: {
		type: [String],
		required: false,
		default: []
	}
});

schema.virtual('iconUrl').get(() =>
{
	return config.imageServerUrl + "/" + this.icon;
});

module.exports = db.model('Application', schema);