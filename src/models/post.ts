import * as mongoose from 'mongoose';
// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
// import config from '../config';

/* tslint:disable:variable-name */
const Schema = mongoose.Schema;

// Common schemas
const postBase: Object = {
	app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	favoritesCount: { type: Number, required: false, default: 0 },
	inReplyToPost: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
	isDeleted: { type: Boolean, required: false, default: false },
	repliesCount: { type: Number, required: false, default: 0 },
	repostsCount: { type: Number, required: false, default: 0 },
	type: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
};

export function post(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	const schema: mongoose.Schema = new Schema(postBase);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('Post', schema, 'Posts');
}

export function status(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema(Object.assign({
		text: { type: String, required: false, default: null },
		isPlain: { type: Boolean, required: false, default: false },
	}, postBase));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('Status', schema, 'Posts');
}

export function photo(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema(Object.assign({
		photos: [{ type: Schema.Types.ObjectId, required: true, ref: 'AlbumFile' }],
		text: { type: String, required: false, default: null },
		isPlain: { type: Boolean, required: false, default: false },
	}, postBase));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('Photo', schema, 'Posts');
}

export function repost(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';

	const schema: mongoose.Schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		isDeleted: { type: Boolean, required: false, default: false },
		post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
		type: { type: String, required: true },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('Repost', schema, 'Posts');
}
