import { Document, Schema } from 'mongoose';
const config: any = require('../config');

export interface UserDocument extends Document {
	name: string;
	createdAt: Date;
	screenName: string;
	screenNameLower: string;
	comment: string;
	color: string;
	description: string;
	location: string;
	websiteUrl: string;
	lang: string;
	email: string;
	hashedPassword: string;
	credit: number;
	pinnedStatusId: string;
	birthday: Date;
	iconId: string;
	bannerId: string;
	wallpaperId: string;
	isVerfied: boolean;
	isEmailVerified: boolean;
	isPro: boolean;
	isPrivate: boolean;
	isDeleted: boolean;
	isSuspended: boolean;
}

export class UserSchema extends Schema {
	constructor() {
		super({
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
		}, {});
		this.virtual('iconUrl').get(() => `${config.imageServerUrl}/${this.iconId}`);
	}
}
