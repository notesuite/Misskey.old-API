import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export default function talkHistory(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	const schema: Schema = new Schema({
		updatedAt: { type: Date, required: true, default: Date.now },
		message: { type: Schema.Types.ObjectId, required: true, ref: 'TalkMessage' },
		otherparty: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
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

	return db.model('TalkHistory', schema, 'TalkHistories');
}
