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
	isDeleted: { type: Boolean, required: false, default: false },
	repliesCount: { type: Number, required: false, default: 0 },
	repostsCount: { type: Number, required: false, default: 0 },
	type: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
};

const statusBase: Object = Object.assign({
	text: { type: String, required: false, default: null },
	isContentModified: { type: Boolean, required: false, default: false },
	isPlain: { type: Boolean, required: false, default: false }
}, postBase);

const replyBase: Object = Object.assign({
	text: { type: String, required: false, default: null },
	inReplyToPost: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
	isContentModified: { type: Boolean, required: false, default: false },
	isPlain: { type: Boolean, required: false, default: false }
}, postBase);

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

	const schema: mongoose.Schema = new Schema(statusBase);

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('Status', schema, 'Posts');
}

export function photoStatus(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const photoStatus: Object = Object.assign({
		attachedPhotos: [{ type: Schema.Types.ObjectId, required: true, ref: 'AlbumFile' }]
	}, statusBase);

	const schema: mongoose.Schema = new Schema(photoStatus);

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('PhotoStatus', schema, 'Posts');
}

export function reply(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema(replyBase);

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('Reply', schema, 'Posts');
}

export function photoReply(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const postReply: Object = Object.assign({
		attachedPhotos: [{ type: Schema.Types.ObjectId, required: true, ref: 'AlbumFile' }]
	}, replyBase);

	const schema: mongoose.Schema = new Schema(postReply);

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('PhotoReply', schema, 'Posts');
}

export function repost(db: mongoose.Connection): mongoose.Model<mongoose.Document> {
	'use strict';
	const postRepost: Object = Object.assign({
		post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' }
	}, postBase);

	const schema: mongoose.Schema = new Schema(postRepost);

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('Repost', schema, 'Posts');
}
