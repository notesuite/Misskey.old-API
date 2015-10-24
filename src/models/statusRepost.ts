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
	statusId: { type: mongoose.Types.ObjectId, required: true },
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
	model: 'Timeline',
	field: 'cursor'
});

export const StatusRepost: mongoose.Model<mongoose.Document> = db.model('StatusRepost', schema);

export interface IStatusRepost extends mongoose.Document {
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
