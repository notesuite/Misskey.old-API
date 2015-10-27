// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import {IUser} from '../models/user';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

const schema: mongoose.Schema = new Schema({
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	name: { type: String, required: true },
	parent: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFolder' },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

if (!(<any>schema).options.toObject) {
	(<any>schema).options.toObject = {};
}
(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;
};

// Auto increment
schema.plugin(mongooseAutoIncrement.plugin, {
	model: 'AlbumFolder',
	field: 'cursor'
});

export const AlbumFolder: mongoose.Model<mongoose.Document> = db.model('AlbumFolder', schema, 'AlbumFolder');

export interface IAlbumFolder extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	name: string;
	parent: mongoose.Types.ObjectId | IAlbumFolder;
	user: mongoose.Types.ObjectId | IUser;
}
