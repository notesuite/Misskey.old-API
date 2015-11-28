import { Schema, Connection, Document, Model } from 'mongoose';

export default function talkHistory(db: Connection): Model<Document> {
	'use strict';

	const deepPopulate: any = require('mongoose-deep-populate')(db);

	const schema = new Schema({
		updatedAt: { type: Date, required: true, default: Date.now },
		message: { type: Schema.Types.ObjectId, required: true, ref: 'TalkMessage' },
		otherparty: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	schema.plugin(deepPopulate);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('TalkHistory', schema, 'TalkHistories');
}
