import * as mongoose from 'mongoose';
import {IPost} from '../models/post';
import {IAlbumFile} from '../models/albumFile';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

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
	email: { type: String, required: false, sparse: true, default: null },
	encryptedPassword: { type: String, required: true },
	credit: { type: Number, required: true },
	pinnedPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Posts' },
	birthday: { type: Date, required: false, default: null },
	icon: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
	banner: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
	wallpaper: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
	iconPath: { type: String, required: false, default: null },
	bannerPath: { type: String, required: false, default: null },
	wallpaperPath: { type: String, required: false, default: null },
	isVerfied: { type: Boolean, required: false, default: false },
	isEmailVerified: { type: Boolean, required: false, default: false },
	isPro: { type: Boolean, required: false, default: false },
	isPrivate: { type: Boolean, required: false, default: false },
	isDeleted: { type: Boolean, required: false, default: false },
	isSuspended: { type: Boolean, required: false, default: false }
});

// schema.virtual('iconUrl').get(() => `${config.imageServerUrl}/${this.icon}`);

if (!(<any>schema).options.toObject) {
	(<any>schema).options.toObject = {};
}
(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
	ret.id = doc.id;

	delete ret.icon;
	delete ret.iconPath;
	ret.iconUrl = doc.icon !== null
		? `${config.userContentsServer.url}/${doc.iconPath}`
		: `${config.userContentsServer.url}/defaults/icon.jpg`;

	delete ret.banner;
	delete ret.bannerPath;
	ret.bannerUrl = doc.banner !== null
		? `${config.userContentsServer.url}/${doc.bannerPath}`
		: `${config.userContentsServer.url}/defaults/banner.jpg`;

	delete ret.wallpaper;
	delete ret.wallpaperPath;
	ret.wallpaperUrl = doc.wallpaper !== null
		? `${config.userContentsServer.url}/${doc.wallpaperPath}`
		: `${config.userContentsServer.url}/defaults/wallpaper.jpg`;

	delete ret._id;
	delete ret.__v;
	delete ret.screenNameLower;
	delete ret.encryptedPassword;
};

export const User: mongoose.Model<mongoose.Document> = db.model('User', schema, 'Users');

export interface IUser extends mongoose.Document {
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
	encryptedPassword: string;
	credit: Number;
	pinnedPost: mongoose.Types.ObjectId | IPost;
	birthday: Date;
	icon: mongoose.Types.ObjectId | IAlbumFile;
	banner: mongoose.Types.ObjectId | IAlbumFile;
	wallpaper: mongoose.Types.ObjectId | IAlbumFile;
	iconPath: string;
	bannerPath: string;
	wallpaperPath: string;
	isVerfied: Boolean;
	isEmailVerified: Boolean;
	isPro: Boolean;
	isPrivate: Boolean;
	isDeleted: Boolean;
	isSuspended: Boolean;
}
