import { Document, Types } from 'mongoose';

export interface IUser extends Document {
	banner: string | Types.ObjectId | IAlbumFile;
	bannerPath: string;
	birthday: Date;
	color: string;
	comment: string;
	createdAt: Date;
	credit: number;
	description: string;
	email: string;
	encryptedPassword: string;
	followersCount: number;
	followingsCount: number;
	avatar: string | Types.ObjectId | IAlbumFile;
	avatarPath: string;
	isDeleted: Boolean;
	isEmailVerified: Boolean;
	isPrivate: Boolean;
	isPro: Boolean;
	isSuspended: Boolean;
	isVerified: Boolean;
	lang: string;
	likedCount: number;
	likesCount: number;
	location: string;
	name: string;
	pinnedPost: string | Types.ObjectId | IPost;
	postsCount: number;
	screenName: string;
	screenNameLower: string;
	timelineReadCursor: number;
	url: string;
	wallpaper: string | Types.ObjectId | IAlbumFile;
	wallpaperPath: string;
}

export interface IUserFollowing extends Document {
	createdAt: Date;
	cursor: number;
	followee: string | Types.ObjectId | IUser;
	follower: string | Types.ObjectId | IUser;
}

export interface IUserKey extends Document {
	app: string | Types.ObjectId | IApplication;
	key: string;
	user: string | Types.ObjectId | IUser;
}

export interface IApplication extends Document {
	createdAt: Date;
	userId: string | Types.ObjectId;
	appKey: string;
	callbackUrl: string;
	description: string;
	iconId: string | Types.ObjectId;
	isDeleted: boolean;
	isSuspended: boolean;
	permissions: string[];
}

export interface IChannel extends Document {
	createdAt: Date;
	name: string;
}

export interface IHashtag extends Document {
	count: number;
	createdAt: Date;
	name: string;
	users: string[] | Types.ObjectId[] | IUser[];
}

export interface IPost extends Document {
	app: string | Types.ObjectId | IApplication;
	channel: string | Types.ObjectId | IChannel;
	createdAt: Date;
	cursor: number;
	inReplyToPost: string | Types.ObjectId | IPost;
	isDeleted: boolean;
	likesCount: number;
	repliesCount: number;
	repostsCount: number;
	type: string;
	user: string | Types.ObjectId | IUser;
}

export interface IStatusPost extends IPost {
	hashtags: string[];
	text: string;
}

export interface IPhotoPost extends IPost {
	photos: string[] | Types.ObjectId[] | IAlbumFile[];
	hashtags: string[];
	text: string;
}

export interface IRepost extends Document {
	app: string | Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	isDeleted: boolean;
	post: string | Types.ObjectId | IPost;
	type: string;
	user: string | Types.ObjectId | IUser;
}

export interface IPostLike extends Document {
	createdAt: Date;
	cursor: number;
	post: string | Types.ObjectId | IPost;
	user: string | Types.ObjectId | IUser;
}

export interface IPostMention extends Document {
	createdAt: Date;
	cursor: number;
	isRead: boolean;
	post: string | Types.ObjectId | IPost;
	user: string | Types.ObjectId | IUser;
}

export interface IAlbumFile extends Document {
	app: string | Types.ObjectId | IApplication;
	createdAt: Date;
	cursor: number;
	dataSize: number;
	folder: string | Types.ObjectId | IAlbumFolder;
	mimeType: string;
	hash: string;
	isDeleted: boolean;
	isHidden: boolean;
	isPrivate: boolean;
	name: string;
	properties: any;
	serverPath: string;
	user: string | Types.ObjectId | IUser;
}

export interface IAlbumFolder extends Document {
	createdAt: Date;
	color: string;
	cursor: number;
	name: string;
	parent: string | Types.ObjectId | IAlbumFolder;
	user: string | Types.ObjectId | IUser;
}

export interface INotification extends Document {
	app: string | Types.ObjectId | IApplication;
	content: Object;
	createdAt: Date;
	cursor: number;
	isRead: boolean;
	type: string;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkGroup extends Document {
	allowInvite: boolean;
	createdAt: Date;
	icon: string | Types.ObjectId | IAlbumFile;
	iconPath: string;
	members: string[] | Types.ObjectId[] | IUser[];
	name: string;
	owner: string | Types.ObjectId | IUser;
}

export interface ITalkGroupInvitation extends Document {
	createdAt: Date;
	group: string | Types.ObjectId | ITalkGroup;
	isRefused: boolean;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkMessage extends Document {
	createdAt: Date;
	cursor: number;
	type: string;
}

export interface ITalkUserMessage extends ITalkMessage {
	file: string | Types.ObjectId | IAlbumFile;
	isContentModified: boolean;
	isDeleted: boolean;
	isRead: boolean;
	otherparty: string | Types.ObjectId | IUser;
	text: string;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkGroupMessage extends ITalkMessage {
	file: string | Types.ObjectId | IAlbumFile;
	group: string | Types.ObjectId | ITalkGroup;
	isContentModified: boolean;
	isDeleted: boolean;
	reads: string[] | Types.ObjectId[] | IUser[];
	text: string;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkGroupSentInvitationActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	invitee: string | Types.ObjectId | IUser;
	inviter: string | Types.ObjectId | IUser;
}

export interface ITalkGroupMemberLeftActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	lefter: string | Types.ObjectId | IUser;
}

export interface ITalkGroupMemberJoinActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	joiner: string | Types.ObjectId | IUser;
}

export interface ITalkRenameGroupActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	renamer: string | Types.ObjectId | IUser;
	oldName: string;
	newName: string;
}

export interface ITalkTransferGroupOwnershipActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	oldOwner: string | Types.ObjectId | IUser;
	newOwner: string | Types.ObjectId | IUser;
}

export interface ITalkHistory extends Document {
	updatedAt: Date;
	message: string | Types.ObjectId | ITalkMessage;
	otherparty: string | Types.ObjectId | IUser;
	user: string | Types.ObjectId | IUser;
}

export interface IBBSTopic extends Document {
	bookmarksCount: number;
	createdAt: Date;
	cursor: number;
	pinnedPost: string | Types.ObjectId | IBBSPost;
	title: string;
	user: string | Types.ObjectId | IUser;
}

export interface IBBSPost extends Document {
	app: string | Types.ObjectId | IApplication;
	files: string | Types.ObjectId[] | IAlbumFile[];
	createdAt: Date;
	cursor: number;
	inReplyToPost: string | Types.ObjectId | IBBSPost;
	isContentModified: boolean;
	isDeleted: boolean;
	isPlain: boolean;
	likesCount: number;
	repliesCount: number;
	text: string;
	topic: string | Types.ObjectId | IBBSTopic;
	user: string | Types.ObjectId | IUser;
}

export interface IBBSWatching extends Document {
	createdAt: Date;
	topic: string | Types.ObjectId | IBBSTopic;
	user: string | Types.ObjectId | IUser;
}
