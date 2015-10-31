import * as mongoose from 'mongoose';
import {IPost} from './post';
import {IAlbumFile} from './albumFile';

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
