// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import {Status, IStatus, serializeStatus} from './status';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

const schema: mongoose.Schema = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true },
	appId: { type: Schema.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	statusId: { type: Schema.Types.ObjectId, required: true },
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

export const StatusRepost: mongoose.Model<mongoose.Document> = db.model('StatusRepost', schema);

export interface IStatusRepost extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	appId: mongoose.Types.ObjectId;
	statusId: mongoose.Types.ObjectId;
	createdAt: Date;
	cursor: number;
	isDeleted: mongoose.Types.ObjectId;
}

export function serializeStatusRepost(repost: IStatusRepost): Promise<Object> {
	'use strict';
	return new Promise((resolve: (serializedStatusRepost: Object) => void, reject: (err: any) => void) => {
		Status.findById(repost.statusId.toString(), (findErr: any, status: IStatus) => {
			if (findErr) {
				reject(findErr);
			} else {
				serializeStatus(status).then((serializedStatus: Object) => {
					const serializedStatusRepost: any = {};
					serializedStatusRepost.createdAt = repost.createdAt;
					serializedStatusRepost.cursor = repost.cursor;
					serializedStatusRepost.repost = serializedStatus;
					resolve(serializedStatusRepost);
				}, (serializeStatusRrr: any) => {
					reject(serializeStatusRrr);
				});
			}
		});
	});
}
