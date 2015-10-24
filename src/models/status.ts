// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import {User, IUser, serializeUser} from '../models/user';
import getStatusStargazers from '../core/getStatusStargazers';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

const schema: mongoose.Schema = new Schema({
	userId: { type: mongoose.Types.ObjectId, required: true },
	appId: { type: mongoose.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	text: { type: String, required: false, default: null },
	attachedFileIds: { type: [mongoose.Types.ObjectId], required: false, default: [] },
	inReplyToStatusId: { type: mongoose.Types.ObjectId, required: false, default: null },
	isContentModified: { type: Boolean, required: false, default: false },
	isDeleted: { type: Boolean, required: false, default: false }
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
	model: 'Timeline',
	field: 'cursor'
});

export function serializeStatus(status: IStatus, options: {
	includeAuthor: boolean;
	includeReplyTarget: boolean;
	includeStargazers: boolean;
} = {
	includeAuthor: true,
	includeReplyTarget: true,
	includeStargazers: true
}): Promise<Object> {
	return new Promise((resolve: (serializedStatus: Object) => void, reject: (err: any) => void) => {
		Promise.all([
			// Get author
			new Promise((getAuthorResolve: (author: Object) => void, getAuthorReject: (err: any) => void) => {
				if (options.includeAuthor) {
					User.findById(status.userId.toString(), (findErr: any, user: IUser) => {
						if (findErr) {
							getAuthorReject(findErr);
						} else {
							getAuthorResolve(user.toObject());
						}
					});
				} else {
					getAuthorResolve(undefined);
				}
			}),
			// Get reply target
			new Promise((getReplyTargetResolve: (replyTarget: Object) => void, getReplyTargetReject: (err: any) => void) => {
				if (options.includeReplyTarget) {
					if (status.inReplyToStatusId !== null) {
						Status.findById(status.inReplyToStatusId.toString(), (findErr: any, replyTargetStatus: IStatus) => {
							if (findErr) {
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
				} else {
					getReplyTargetResolve(undefined);
				}
			}),
			// Get stargazers
			new Promise((getStargazersResolve: (stargazers: Object[]) => void, getStargazersReject: (err: any) => void) => {
				if (options.includeStargazers) {
					getStatusStargazers(status.id, 10).then((stargazers: IUser[]) => {
						getStargazersResolve(stargazers.map((stargazer: IUser) => {
							return stargazer.toObject();
						}));
					}, (getStargazersErr: any) => {
						getStargazersReject(getStargazersErr);
					});
				} else {
					getStargazersResolve(undefined);
				}
			}),
		]).then((results: any[]) => {
			const serializedStatus: any = status.toObject();
			serializedStatus.user = results[0];
			serializedStatus.replyTarget = results[1];
			serializedStatus.stargazers = results[2];
			resolve(serializedStatus);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}

export const Status: mongoose.Model<mongoose.Document> = db.model('Status', schema);

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
