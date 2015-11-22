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
	followee: string | mongoose.Types.ObjectId | IUser;
	follower: string | mongoose.Types.ObjectId | IUser;
}

export interface IUserKey extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	key: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IApplication extends mongoose.Document {
	createdAt: Date;
	userId: string | mongoose.Types.ObjectId;
	appKey: string;
	callbackUrl: string;
	description: string;
	iconId: string | mongoose.Types.ObjectId;
	isDeleted: boolean;
	isSuspended: boolean;
	permissions: string[];
}

export interface IHashtag extends mongoose.Document {
	createdAt: Date;
	name: string;
}

export interface IPost extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	inReplyToPost: string | mongoose.Types.ObjectId | IPost;
	isDeleted: boolean;
	likesCount: number;
	repliesCount: number;
	repostsCount: number;
	type: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IStatusPost extends IPost {
	isPlain: boolean;
	hashtags: string[];
	text: string;
}

export interface IPhotoPost extends IPost {
	isPlain: boolean;
	photos: string | mongoose.Types.ObjectId[] | IAlbumFile[];
	hashtags: string[];
	text: string;
}

export interface IRepost extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	isDeleted: boolean;
	post: string | mongoose.Types.ObjectId | IPost;
	type: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IPostLike extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	post: string | mongoose.Types.ObjectId | IPost;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface IPostMention extends mongoose.Document {
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

export interface INotification extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	content: Object;
	createdAt: Date;
	cursor: number;
	isRead: boolean;
	type: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface ITalkMessage extends mongoose.Document {
	app: string | mongoose.Types.ObjectId | IApplication;
	attachedFiles: string | mongoose.Types.ObjectId[] | IAlbumFile[];
	createdAt: Date;
	cursor: number;
	isContentModified: boolean;
	isDeleted: boolean;
	isPlain: boolean;
	isRead: boolean;
	otherparty: string | mongoose.Types.ObjectId | IUser;
	text: string;
	user: string | mongoose.Types.ObjectId | IUser;
}

export interface ITalkHistory extends mongoose.Document {
	updatedAt: Date;
	message: string | mongoose.Types.ObjectId | ITalkMessage;
	otherparty: string | mongoose.Types.ObjectId | IUser;
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
