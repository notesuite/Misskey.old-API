import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export default function hashtag(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	const schema: mongoose.Schema = new Schema({
		createdAt: { type: Date, required: true, default: Date.now },
		name: { type: String, required: true, unique: true }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('Hashtag', schema, 'Hashtags');
}
