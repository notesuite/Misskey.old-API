import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

import config from '../config';

export default function albumFile(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		dataSize: { type: Number, required: true },
		folder: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFolder' },
		mimeType: { type: String, required: true },
		hash: { type: String, required: false, default: null },
		isDeleted: { type: Boolean, required: false, default: false },
		isHidden: { type: Boolean, required: false, default: false },
		isPrivate: { type: Boolean, required: false, default: false },
		name: { type: String, required: true },
		properties: { type: Schema.Types.Mixed, required: false, default: null },
		serverPath: { type: String, required: false },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		ret.url = `${config.userContentsServer.url}/${doc.serverPath}`;
		delete ret._id;
		delete ret.__v;
	};

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'AlbumFile',
		field: 'cursor'
	});

	return db.model('AlbumFile', schema, 'AlbumFiles');
}
