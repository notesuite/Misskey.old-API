// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import * as mongoose from 'mongoose';
import {IUser} from '../models/user';
import {IPost} from '../models/post';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

mongooseAutoIncrement.initialize(db);

const schema: mongoose.Schema = new Schema({
	createdAt: { type: Date, required: true, default: Date.now },
	cursor: { type: Number },
	post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
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
	model: 'Favorite',
	field: 'cursor'
});

export const Favorite: mongoose.Model<mongoose.Document> = db.model('Favorite', schema);

export interface IFavorite extends mongoose.Document {
	post: mongoose.Types.ObjectId | IPost;
	user: mongoose.Types.ObjectId | IUser;
	createdAt: Date;
	cursor: number;
}
