import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
	banner: string | mongoose.Types.ObjectId | IAlbumFile;
	bannerPath: string;
	birthday: Date;
	color: string;
	comment: string;
	createdAt: Date;
	credit: Number;
	description: string;
	email: string;
	encryptedPassword: string;
	followersCount: number;
	followingsCount: number;
	icon: string | mongoose.Types.ObjectId | IAlbumFile;
	iconPath: string;
	isDeleted: Boolean;
	isEmailVerified: Boolean;
	isPrivate: Boolean;
	isPro: Boolean;
	isSuspended: Boolean;
	isVerified: Boolean;
	lang: string;
	location: string;
	name: string;
	pinnedPost: string | mongoose.Types.ObjectId | IPost;
	postsCount: number;
	screenName: string;
	screenNameLower: string;
	wallpaper: string | mongoose.Types.ObjectId | IAlbumFile;
	wallpaperPath: string;
	websiteUrl: string;
}

export interface IUserFollowing extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	followee: string | mongoose.Types.ObjectId;
	follower: string | mongoose.Types.ObjectId;
}

export interface IApplication extends mongoose.Document {
	createdAt: Date;
	userId: string | mongoose.Types.ObjectId;
	appKey: string;
	callbackUrl: string;
	description: string;
	iconId: string | mongoose.Types.ObjectId;
	permissions: string[];
	isSuspended: boolean;
	idDeleted: boolean;
}

export interface IPost extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	favoritesCount: number;
	isDeleted: boolean;
	repliesCount: number;
	repostsCount: number;
	type: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IStatus extends IPost {
	text: string;
	attachedFiles: string | mongoose.Types.ObjectId[] | IAlbumFile[];
	inReplyToPost: string | mongoose.Types.ObjectId | IPost;
	isContentModified: boolean;
	isPlain: boolean;
}

export interface IRepost extends IPost {
	post: string | mongoose.Types.ObjectId | IPost;
}

export interface IPostFavorite extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	post: string | mongoose.Types.ObjectId | IPost;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IAlbumFile extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	dataSize: number;
	folder: string | mongoose.Types.ObjectId | IAlbumFolder;
	mimeType: string;
	hash: string;
	isDeleted: boolean;
	isHidden: boolean;
	isPrivate: boolean;
	name: string;
	properties: Object;
	serverPath: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IAlbumFolder extends mongoose.Document {
	createdAt: Date;
	color: string;
	cursor: number;
	name: string;
	parent: string | mongoose.Types.ObjectId | IAlbumFolder;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IBBSTopic extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	title: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IBBSPost extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	attachedFiles: string | mongoose.Types.ObjectId[] | IAlbumFile[];
	createdAt: Date;
	cursor: number;
	inReplyToPost: string | mongoose.Types.ObjectId | IBBSPost;
	isContentModified: boolean;
	isDeleted: boolean;
	isPlain: boolean;
	plusonesCount: number;
	text: string;
	topic: string | mongoose.Types.ObjectId | IBBSTopic;
	user: string | mongoose.Types.ObjectId | IUser;
}
