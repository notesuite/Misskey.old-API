import { Schema, Connection, Document, Model } from 'mongoose';

export default function(db: Connection): Model<Document> {
	'use strict';

	const schema = new Schema({
		createdAt: { type: Date, required: true, default: Date.now },
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		isRefused: { type: Boolean, required: false, default: false },
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

	return db.model('TalkGroupInvitation', schema, 'TalkGroupInvitations');
}
