import { Schema, Connection, Document, Model } from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

const base: Object = {
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number }
};

const toObject: any = (doc: any, ret: any) => {
	ret.id = doc.id;
	ret.isModified = doc.isContentModified;
	delete ret.isContentModified;
	delete ret._id;
	delete ret.__v;
};

export function message(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(base);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('Message', schema, 'TalkMessages');
}

export function userMessage(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(Object.assign({
		file: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		isContentModified: { type: Boolean, required: false, default: false },
		isDeleted: { type: Boolean, required: false, default: false },
		isRead: { type: Boolean, required: false, default: false },
		recipient: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		text: { type: String, required: false, default: '' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	}, base));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('UserMessage', schema, 'TalkMessages');
}

export function groupMessage(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(Object.assign({
		file: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		isContentModified: { type: Boolean, required: false, default: false },
		isDeleted: { type: Boolean, required: false, default: false },
		reads: [{ type: Schema.Types.ObjectId, required: false, default: null, ref: 'User' }],
		text: { type: String, required: false, default: '' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	}, base));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('GroupMessage', schema, 'TalkMessages');
}

export function groupSentInvitationActivity(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(Object.assign({
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		invitee: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		inviter: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'group-sent-invitation-activity' }
	}, base));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('GroupSentInvitationActivity', schema, 'TalkMessages');
}

export function groupMemberJoinActivity(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(Object.assign({
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		joiner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'group-member-join-activity' }
	}, base));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('GroupMemberJoinActivity', schema, 'TalkMessages');
}

export function groupMemberLeftActivity(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(Object.assign({
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		lefter: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'group-member-left-activity' }
	}, base));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('GroupMemberLeftActivity', schema, 'TalkMessages');
}

export function renameGroupActivity(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(Object.assign({
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		renamer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		oldName: { type: String, required: true },
		newName: { type: String, required: true },
		type: { type: String, required: false, default: 'rename-group-activity' }
	}, base));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('RenameGroupActivity', schema, 'TalkMessages');
}

export function transferGroupOwnershipActivity(db: Connection): Model<Document> {
	'use strict';
	mongooseAutoIncrement.initialize(db);

	const schema = new Schema(Object.assign({
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		oldOwner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		newOwner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'transfer-group-ownership-activity' }
	}, base));

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'TalkMessage',
		field: 'cursor'
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TransferGroupOwnershipActivity', schema, 'TalkMessages');
}
