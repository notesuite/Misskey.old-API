import { Schema, Connection, Document, Model } from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

export default function talkMessage(db: Connection): Model<Document> {
	'use strict';

	mongooseAutoIncrement.initialize(db);

	const schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		file: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		isContentModified: { type: Boolean, required: false, default: false },
		isDeleted: { type: Boolean, required: false, default: false },
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
