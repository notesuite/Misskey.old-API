import * as mongoose from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

/* tslint:disable:variable-name */
const Schema = mongoose.Schema;

export default function notification(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		content: { type: Schema.Types.Mixed, required: false, default: {} },
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		isRead: { type: Boolean, required: false, default: false },
		type: { type: String, required: true },
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
		model: 'Notification',
		field: 'cursor'
	});

	return db.model('Notification', schema, 'Notifications');
}
