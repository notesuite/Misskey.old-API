import {Schema, Connection, Document, Model} from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

// Base schema of post
const base: Object = {
	app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
	channel: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Channel' },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	isDeleted: { type: Boolean, required: false, default: false },
	likesCount: { type: Number, required: false, default: 0 },
	repliesCount: { type: Number, required: false, default: 0 },
	repostsCount: { type: Number, required: false, default: 0 },
	// 各スキーマが実装します
	// type: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
};

const toObject: any = (doc: any, ret: any) => {
	// General
	ret.id = doc.id;
	ret.userId = ret.user;

	// Remove needless properties
	delete ret._id;
	delete ret.__v;

	switch (doc.type) {
		case 'status':
			break;
		case 'reply':
			ret.userId = ret.user;
			ret.inReplyToPostId = ret.inReplyToPost;
			break;
		default:
			break;
	}
};

function initSchema(db: Connection, schema: Schema): void {
	'use strict';

	mongooseAutoIncrement.initialize(db);

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;
}

export function post(db: Connection): Model<Document> {
	'use strict';

	const schema = new Schema(Object.assign({
		type: { type: String, required: true }
	}, base));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('Post', schema, 'Posts');
}

export function status(db: Connection): Model<Document> {
	'use strict';

	const schema = new Schema(Object.assign({
		files: { type: [Schema.Types.ObjectId], required: false, default: null, ref: 'AlbumFile' },
		hashtags: { type: [String], required: false, default: [] },
		text: { type: String, required: false, default: null },
		type: { type: String, required: true, default: 'status' }
	}, base));

	initSchema(db, schema);

	return db.model('Status', schema, 'Posts');
}

export function reply(db: Connection): Model<Document> {
	'use strict';

	const schema = new Schema(Object.assign({
		files: { type: [Schema.Types.ObjectId], required: false, default: null, ref: 'AlbumFile' },
		hashtags: { type: [String], required: false, default: [] },
		inReplyToPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
		text: { type: String, required: false, default: null },
		type: { type: String, required: true, default: 'reply' }
	}, base));

	initSchema(db, schema);

	return db.model('Reply', schema, 'Posts');
}

export function repost(db: Connection): Model<Document> {
	'use strict';

	const schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		isDeleted: { type: Boolean, required: false, default: false },
		post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
		type: { type: String, required: true, default: 'repost' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	initSchema(db, schema);

	return db.model('Repost', schema, 'Posts');
}
