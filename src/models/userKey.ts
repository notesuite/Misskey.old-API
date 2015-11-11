import * as mongoose from 'mongoose';

/* tslint:disable:variable-name */
const Schema = mongoose.Schema;

export default function(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	const schema: mongoose.Schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		key: { type: String, required: true, unique: true },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	return db.model('UserKey', schema, 'UserKeys');
}
