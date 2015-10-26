// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import {User, IUser} from '../models/user';
import getStatusStargazers from '../core/getStatusStargazers';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

const schema: mongoose.Schema = new Schema({
	appId: { type: Schema.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	favoritesCount: { type: Number, required: false, default: 0 },
	isDeleted: { type: Boolean, required: false, default: false },
	repliesCount: { type: Number, required: false, default: 0 },
	repostsCount: { type: Number, required: false, default: 0 },
	userId: { type: Schema.Types.ObjectId, required: true }
});

if (!(<any>schema).options.toObject) {
	(<any>schema).options.toObject = {};
}
(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;
	return ret;
};

// Auto increment
schema.plugin(mongooseAutoIncrement.plugin, {
	model: 'Post',
	field: 'cursor'
});

export const Status: mongoose.Model<mongoose.Document> = db.model('Post', schema);

export interface IStatus extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	appId: mongoose.Types.ObjectId;
	createdAt: Date;
	cursor: number;
	text: string;
	attachedFileIds: mongoose.Types.ObjectId[];
	inReplyToStatusId: mongoose.Types.ObjectId;
	isContentModified: boolean;
	isDeleted: boolean;
}

export function serializeStatus(status: IStatus, options: {
	includeAuthor: boolean;
	includeReplyTarget: boolean;
	includeStargazers: boolean;
} = {
	includeAuthor: true,
	includeReplyTarget: true,
	includeStargazers: true
}): Promise<Object> {
	'use strict';
	return new Promise((resolve: (serializedStatus: Object) => void, reject: (err: any) => void) => {
		Promise.all([
			// Get author
			new Promise((getAuthorResolve: (author: Object) => void, getAuthorReject: (err: any) => void) => {
				if (options.includeAuthor) {
					User.findById(status.userId.toString(), (findErr: any, user: IUser) => {
						if (findErr !== null) {
							getAuthorReject(findErr);
						} else {
							getAuthorResolve(user.toObject());
						}
					});
				}
			}),
			// Get reply target
			new Promise((getReplyTargetResolve: (replyTarget: Object) => void, getReplyTargetReject: (err: any) => void) => {
				if (options.includeReplyTarget) {
					if (status.inReplyToStatusId !== null) {
						Status.findById(status.inReplyToStatusId.toString(), (findErr: any, replyTargetStatus: IStatus) => {
							if (findErr !== null) {
								getReplyTargetReject(findErr);
							} else if (replyTargetStatus !== null) {
								serializeStatus(replyTargetStatus, {
									includeAuthor: true,
									includeReplyTarget: false,
									includeStargazers: false
								}).then((serializedStatus: Object) => {
									getReplyTargetResolve(serializedStatus);
								},
								(serializedStatusErr: any) => {
									getReplyTargetReject(serializedStatusErr);
								});
							} else {
								getReplyTargetResolve(null);
							}
						});
					} else {
						getReplyTargetResolve(undefined);
					}
				}
			}),
			// Get stargazers
			new Promise((getStargazersResolve: (stargazers: Object[]) => void, getStargazersReject: (err: any) => void) => {
				if (options.includeStargazers) {
					getStatusStargazers(status.id, 10).then((stargazers: IUser[]) => {
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
			}),
		]).then((results: any[]) => {
			const serializedStatus: any = status.toObject();
			if (options.includeAuthor && results[0] !== undefined) {
				serializedStatus.user = results[0];
			}
			if (options.includeReplyTarget && results[1] !== undefined) {
				serializedStatus.replyTarget = results[1];
			}
			if (options.includeStargazers && results[2] !== undefined) {
				serializedStatus.stargazers = results[2];
			}
			resolve(serializedStatus);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}
