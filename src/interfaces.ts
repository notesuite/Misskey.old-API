import * as mongoose from 'mongoose';

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
	isVerified: Boolean;
	isEmailVerified: Boolean;
	isPro: Boolean;
	isPrivate: Boolean;
	isDeleted: Boolean;
	isSuspended: Boolean;
}

export interface IUserFollowing extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	followee: mongoose.Types.ObjectId;
	follower: mongoose.Types.ObjectId;
}

export interface IApplication extends mongoose.Document {
	createdAt: Date;
	userId: mongoose.Types.ObjectId;
	appKey: string;
	callbackUrl: string;
	description: string;
	iconId: mongoose.Types.ObjectId;
	permissions: string[];
	isSuspended: boolean;
	idDeleted: boolean;
}

export interface IPost extends mongoose.Document {
	app: mongoose.Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	favoritesCount: number;
	isDeleted: boolean;
	repliesCount: number;
	repostsCount: number;
	type: string;
	user: mongoose.Types.ObjectId | IUser;
}

export interface IStatus extends IPost {
	text: string;
	attachedFiles: mongoose.Types.ObjectId[] | IAlbumFile[];
	inReplyToPost: mongoose.Types.ObjectId | IPost;
	isContentModified: boolean;
}

export interface IRepost extends IPost {
	post: mongoose.Types.ObjectId | IPost;
}

export interface IPostFavorite extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	post: mongoose.Types.ObjectId | IPost;
	user: mongoose.Types.ObjectId | IUser;
}

export interface IAlbumFile extends mongoose.Document {
	app: mongoose.Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	dataSize: number;
	folder: mongoose.Types.ObjectId | IAlbumFolder;
	mimeType: string;
	hash: string;
	isDeleted: boolean;
	isHidden: boolean;
	isPrivate: boolean;
	name: string;
	properties: Object;
	serverPath: string;
	user: mongoose.Types.ObjectId | IUser;
}

export interface IAlbumFolder extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	name: string;
	parent: mongoose.Types.ObjectId | IAlbumFolder;
	user: mongoose.Types.ObjectId | IUser;
}

