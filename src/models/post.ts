import * as mongoose from 'mongoose';
// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');

import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

// Common schema
const postBase: Object = {
	app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Applications' },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	favoritesCount: { type: Number, required: false, default: 0 },
	isDeleted: { type: Boolean, required: false, default: false },
	repliesCount: { type: Number, required: false, default: 0 },
	repostsCount: { type: Number, required: false, default: 0 },
	type: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' }
};

export function post(db: mongoose.Connection) {
	mongooseAutoIncrement.initialize(db);

	const postBaseSchema: mongoose.Schema = new Schema(postBase);

	return db.model('Post', postBaseSchema, 'Posts');
}

export function postStatus(db: mongoose.Connection) {
	mongooseAutoIncrement.initialize(db);

	const postStatus: Object = Object.assign({
		text: { type: String, required: false, default: null },
		attachedFiles: [{ type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' }],
		inReplyToPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Posts' },
		isContentModified: { type: Boolean, required: false, default: false }
	}, postBase);

	const postStatusSchema: mongoose.Schema = new Schema(postStatus);

	if (!(<any>postStatusSchema).options.toObject) {
		(<any>postStatusSchema).options.toObject = {};
	}
	(<any>postStatusSchema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	// Auto increment
	postStatusSchema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('PostStatus', postStatusSchema, 'Posts');
}

export function postRepost(db: mongoose.Connection) {
	const postRepost: Object = Object.assign({
		post: { type: Schema.Types.ObjectId, required: true, ref: 'Posts' }
	}, postBase);

	const postRepostSchema: mongoose.Schema = new Schema(postRepost);

	if (!(<any>postRepostSchema).options.toObject) {
		(<any>postRepostSchema).options.toObject = {};
	}
	(<any>postRepostSchema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	// Auto increment
	postRepostSchema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	return db.model('PostRepost', postRepostSchema, 'Posts');
}
