import * as mongoose from 'mongoose';
// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');

/* tslint:disable:variable-name */
const Schema = mongoose.Schema;

export default function userFollowing(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema({
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		followee: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		follower: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'UserFollowing',
		field: 'cursor'
	});

	return db.model('UserFollowing', schema, 'UserFollowings');
}
