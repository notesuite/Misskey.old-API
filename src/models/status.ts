// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

const schema: mongoose.Schema = new Schema({
	userId: { type: mongoose.Types.ObjectId, required: true },
	appId: { type: mongoose.Types.ObjectId, required: false, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	text: { type: String, required: false, default: null },
	attachedFileIds: { type: [mongoose.Types.ObjectId], required: false, default: [] },
	inReplyToStatusId: { type: mongoose.Types.ObjectId, required: false, default: null },
	isContentModified: { type: Boolean, required: false, default: false },
	isDeleted: { type: Boolean, required: false, default: false }
});

if (!(<any>schema).options.toObject) {
	(<any>schema).options.toObject = {};
}
(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;
	return ret;
};

// Auto increment
schema.plugin(mongooseAutoIncrement.plugin, {
	model: 'Status',
	field: 'cursor'
});

export const Status: mongoose.Model<mongoose.Document> = db.model('Status', schema);

export interface IStatus extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	appId: mongoose.Types.ObjectId;
	createdAt: Date;
	cursor: number;
	text: string;
	attachedFileIds: mongoose.Types.ObjectId[];
	inReplyToStatusId: mongoose.Types.ObjectId;
	isContentModified: mongoose.Types.ObjectId;
	isDeleted: mongoose.Types.ObjectId;
}
