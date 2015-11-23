import * as mongoose from 'mongoose';
// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
// import config from '../config';

/* tslint:disable:variable-name */
const Schema = mongoose.Schema;

export default function talkMessage(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		attachedFiles: [{ type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' }],
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		isContentModified: { type: Boolean, required: false, default: false },
		isDeleted: { type: Boolean, required: false, default: false },
		isPlain: { type: Boolean, required: false, default: false },
		isRead: { type: Boolean, required: false, default: false },
		otherparty: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		text: { type: String, required: true },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	return db.model('TalkMessage', schema, 'TalkMessages');
}
