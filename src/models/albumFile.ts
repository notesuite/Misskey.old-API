// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import {IUser} from '../models/user';
import {IAlbumFolder} from '../models/albumFolder';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

const schema: mongoose.Schema = new Schema({
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	dataSize: { type: Number, required: true },
	folder: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFolder' },
	format: { type: String, required: true },
	hash: { type: String, required: true },
	isDeleted: { type: Boolean, required: false, default: false },
	isPrivate: { type: Boolean, required: false, default: false },
	name: { type: String, required: true },
	serverPath: { type: String, required: true },
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
	model: 'AlbumFile',
	field: 'cursor'
});

export const AlbumFile: mongoose.Model<mongoose.Document> = db.model('AlbumFile', schema, 'AlbumFile');

export interface IAlbumFile extends mongoose.Document {
	createdAt: Date;
	cursor: number;
	dataSize: number;
	folder: mongoose.Types.ObjectId | IAlbumFolder;
	format: string;
	hash: string;
	isDeleted: boolean;
	isPrivate: boolean;
	name: string;
	serverPath: string;
	user: mongoose.Types.ObjectId | IUser;
}
