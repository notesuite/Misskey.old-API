import * as mongoose from 'mongoose';

const config: any = require('../config');

// Grobal option
const modelName: string = 'User';

// Mongo settings
const Schema: typeof mongoose.Schema = mongoose.Schema;
const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

// Declare scheme
const schema: mongoose.Schema = new Schema({
	name: { type: String, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	screenName: { type: String, required: true, unique: true },
	screenNameLower: { type: String, required: true, unique: true, lowercase: true },
	comment: { type: String, required: false, default: null },
	color: { type: String, required: false, default: null },
	description: { type: String, required: false, default: null },
	location: { type: String, required: false, default: null },
	websiteUrl: { type: String, required: false, default: null },
	lang: { type: String, required: true },
	email: { type: String, required: false, unique: true, sparse: true, default: null },
	hashedPassword: { type: String, required: true },
	credit: { type: Number, required: true },
	pinnedStatus: { type: Schema.Types.ObjectId, required: false, default: null },
	birthday: { type: Date, required: false, default: null },
	icon: { type: Schema.Types.ObjectId, required: false, default: null },
	banner: { type: Schema.Types.ObjectId, required: false, default: null },
	wallpaper: { type: Schema.Types.ObjectId, required: false, default: null },
	isVerfied: { type: Boolean, required: false, default: false },
	isEmailVerified: { type: Boolean, required: false, default: false },
	isPro: { type: Boolean, required: false, default: false },
	isPrivate: { type: Boolean, required: false, default: false },
	isDeleted: { type: Boolean, required: false, default: false },
	isSuspended: { type: Boolean, required: false, default: false },
});

// Declare iconUrl virtual property
schema.virtual('iconUrl').get(() => {
	return config.imageServerUrl + "/" + this.icon;
});

// Export model
module.exports = db.model(modelName, schema);
