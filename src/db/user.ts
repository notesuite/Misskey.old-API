import { Schema } from 'mongoose';
const config: any = require('../config');

const schema: Schema = new Schema({
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
	pinnedStatusId: { type: Schema.Types.ObjectId, required: false, default: null },
	birthday: { type: Date, required: false, default: null },
	iconId: { type: Schema.Types.ObjectId, required: false, default: null },
	bannerId: { type: Schema.Types.ObjectId, required: false, default: null },
	wallpaperId: { type: Schema.Types.ObjectId, required: false, default: null },
	isVerfied: { type: Boolean, required: false, default: false },
	isEmailVerified: { type: Boolean, required: false, default: false },
	isPro: { type: Boolean, required: false, default: false },
	isPrivate: { type: Boolean, required: false, default: false },
	isDeleted: { type: Boolean, required: false, default: false },
	isSuspended: { type: Boolean, required: false, default: false }
});

schema.virtual('iconUrl').get(() => `${config.imageServerUrl}/${this.icon}`);
