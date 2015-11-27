import { Schema, Connection, Document, Model } from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

// Common schemas
const postBase: Object = {
	app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	inReplyToPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	isDeleted: { type: Boolean, required: false, default: false },
	likesCount: { type: Number, required: false, default: 0 },
	repliesCount: { type: Number, required: false, default: 0 },
	repostsCount: { type: Number, required: false, default: 0 },
	type: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
};

const toObject: any = (doc: any, ret: any) => {
	// General
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;

	switch (doc.type) {
		case 'status':
			ret.userId = ret.user;
			ret.inReplyToPostId = ret.inReplyToPost;
			break;
		case 'photo':
			ret.userId = ret.user;
			ret.inReplyToPostId = ret.inReplyToPost;
			break;
		default:
			break;
	}
};

export function post(db: Connection): Model<Document> {
	'use strict';

	const schema: Schema = new Schema(postBase);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('Post', schema, 'Posts');
}

export function status(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema: Schema = new Schema(Object.assign({
		hashtags: { type: [String], required: false, default: [] },
		text: { type: String, required: false, default: null },
		isPlain: { type: Boolean, required: false, default: false }
	}, postBase));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('Status', schema, 'Posts');
}

export function photo(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema: Schema = new Schema(Object.assign({
		photos: [{ type: Schema.Types.ObjectId, required: true, ref: 'AlbumFile' }],
		hashtags: { type: [String], required: false, default: [] },
		text: { type: String, required: false, default: null },
		isPlain: { type: Boolean, required: false, default: false }
	}, postBase));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('Photo', schema, 'Posts');
}

export function repost(db: Connection): Model<Document> {
	'use strict';

	const schema: Schema = new Schema({
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

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('Repost', schema, 'Posts');
}
