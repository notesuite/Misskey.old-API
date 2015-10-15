import { Schema } from 'mongoose';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');

const schema: Schema = new Schema({
	appId: { type: Schema.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	attachedFileIds: { type: [Schema.Types.ObjectId], default: [] },
	inReplyToStatusId: { type: Schema.Types.ObjectId, default: null },
	isDeleted: { type: Boolean, required: false, default: false },
	text: { type: String, default: null },
	userId: { type: Schema.Types.ObjectId, required: true }
});

schema.plugin(mongooseAutoIncrement.plugin, {
	model: 'Status',
	field: 'cursor'
});
