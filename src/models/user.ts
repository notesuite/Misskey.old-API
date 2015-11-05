import * as mongoose from 'mongoose';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

module.exports = (db: mongoose.Connection) => {
	const schema: mongoose.Schema = new Schema({
		banner: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
		bannerPath: { type: String, required: false, default: null },
		birthday: { type: Date, required: false, default: null },
		color: { type: String, required: false, default: null },
		comment: { type: String, required: false, default: null },
		createdAt: { type: Date, required: true, default: Date.now },
		credit: { type: Number, required: true },
		description: { type: String, required: false, default: null },
		email: { type: String, required: false, sparse: true, default: null },
		encryptedPassword: { type: String, required: true },
		followersCount: { type: Number, required: false, default: 0 },
		followingsCount: { type: Number, required: false, default: 0 },
		icon: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
		iconPath: { type: String, required: false, default: null },
		isDeleted: { type: Boolean, required: false, default: false },
		isEmailVerified: { type: Boolean, required: false, default: false },
		isPrivate: { type: Boolean, required: false, default: false },
		isPro: { type: Boolean, required: false, default: false },
		isSuspended: { type: Boolean, required: false, default: false },
		isVerified: { type: Boolean, required: false, default: false },
		lang: { type: String, required: true },
		location: { type: String, required: false, default: null },
		name: { type: String, required: true },
		pinnedPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Posts' },
		postsCount: { type: Number, required: false, default: 0 },
		screenName: { type: String, required: true, unique: true },
		screenNameLower: { type: String, required: true, unique: true, lowercase: true },
		wallpaper: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
		wallpaperPath: { type: String, required: false, default: null },
		websiteUrl: { type: String, required: false, default: null }
	});

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

	return db.model('User', schema, 'Users');
};
