// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import {IUser} from '../models/user';
import {IApplication} from '../models/application';
import {IAlbumFile} from '../models/albumFile';
import getPostStargazers from '../core/getPostStargazers';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

// Common schema
const postBase: Object = {
	app: { type: Schema.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	favoritesCount: { type: Number, required: false, default: 0 },
	isDeleted: { type: Boolean, required: false, default: false },
	repliesCount: { type: Number, required: false, default: 0 },
	repostsCount: { type: Number, required: false, default: 0 },
	type: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' }
};

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

const postBaseSchema: mongoose.Schema = new Schema(postBase);

export const Post: mongoose.Model<mongoose.Document> = db.model('Post', postBaseSchema, 'Posts');

// Extend post base
const postStatus: Object = Object.assign({
	text: { type: String, required: false, default: null },
	attachedFiles: [{ type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' }],
	inReplyToPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Posts' },
	isContentModified: { type: Boolean, required: false, default: false }
}, postBase);

export interface IPostStatus extends IPost {
	text: string;
	attachedFiles: mongoose.Types.ObjectId[] | IAlbumFile[];
	inReplyToStatus: mongoose.Types.ObjectId | IPostStatus;
	isContentModified: boolean;
}

const postStatusSchema: mongoose.Schema = new Schema(postStatus);

if (!(<any>postStatusSchema).options.toObject) {
	(<any>postStatusSchema).options.toObject = {};
}
(<any>postStatusSchema).options.toObject.transform = (doc: any, ret: any) => {
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;
};

// Auto increment
postStatusSchema.plugin(mongooseAutoIncrement.plugin, {
	model: 'Post',
	field: 'cursor'
});

export const PostStatus: mongoose.Model<mongoose.Document> = db.model('PostStatus', postStatusSchema, 'Posts');

export function serializeStatus(status: IPostStatus, options: {
	includeStargazers: boolean;
} = {
	includeStargazers: true
}): Promise<Object> {
	'use strict';
	return new Promise((resolve: (serializedStatus: Object) => void, reject: (err: any) => void) => {
		Promise.all([
			// Get stargazers
			new Promise((getStargazersResolve: (stargazers: Object[]) => void, getStargazersReject: (err: any) => void) => {
				if (options.includeStargazers) {
					getPostStargazers(status.id, 10).then((stargazers: IUser[]) => {
						if (stargazers !== null && stargazers.length > 0) {
							getStargazersResolve(stargazers.map((stargazer: IUser) => {
								return stargazer.toObject();
							}));
						} else {
							getStargazersResolve(null);
						}
					}, (getStargazersErr: any) => {
						getStargazersReject(getStargazersErr);
					});
				}
			})
		]).then((results: any[]) => {
			const serializedStatus: any = status.toObject();
			if (options.includeStargazers && results[0] !== undefined) {
				serializedStatus.stargazers = results[0];
			}
			resolve(serializedStatus);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}

// Extend post base
const postRepost: Object = Object.assign({
	post: { type: Schema.Types.ObjectId, required: true, ref: 'Posts' }
}, postBase);

export interface IPostRepost extends IPost {
	post: mongoose.Types.ObjectId | IPostRepost;
}

const postRepostSchema: mongoose.Schema = new Schema(postRepost);

if (!(<any>postRepostSchema).options.toObject) {
	(<any>postRepostSchema).options.toObject = {};
}
(<any>postRepostSchema).options.toObject.transform = (doc: any, ret: any) => {
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;
};

// Auto increment
postRepostSchema.plugin(mongooseAutoIncrement.plugin, {
	model: 'Post',
	field: 'cursor'
});

export const PostRepost: mongoose.Model<mongoose.Document> = db.model('PostRepost', postRepostSchema, 'Posts');
