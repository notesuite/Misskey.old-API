// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

const schema: mongoose.Schema = new Schema({
	userId: { type: mongoose.Types.ObjectId, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	statusId: { type: mongoose.Types.ObjectId, required: true }
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

export const StatusFavorite: mongoose.Model<mongoose.Document> = db.model('StatusFavorite', schema);

export interface IStatusFavorite extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	statusId: mongoose.Types.ObjectId;
	createdAt: Date;
	cursor: number;
}
