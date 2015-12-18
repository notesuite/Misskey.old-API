import * as mongoose from 'mongoose';
import { Schema, Connection, Document, Model } from 'mongoose';

const base: Object = {
	updatedAt: { type: Date, required: true, default: Date.now },
	message: { type: Schema.Types.ObjectId, required: true, ref: 'TalkMessage' },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
};

export function talkUserHistory(db: Connection): Model<Document> {
	'use strict';

	const deepPopulate: any = require('mongoose-deep-populate')(mongoose);

	const schema = new Schema(Object.assign({
		recipient: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	}, base));

	schema.plugin(deepPopulate);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('TalkUserHistory', schema, 'TalkHistories');
}

export function talkGroupHistory(db: Connection): Model<Document> {
	'use strict';

	const deepPopulate: any = require('mongoose-deep-populate')(mongoose);

	const schema = new Schema(Object.assign({
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' }
	}, base));

	schema.plugin(deepPopulate);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('TalkGroupHistory', schema, 'TalkHistories');
}
