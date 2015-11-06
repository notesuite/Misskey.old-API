import * as mongoose from 'mongoose';
// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
// import config from '../config';

/* tslint:disable:variable-name */
const Schema = mongoose.Schema;

module.exports = (db: mongoose.Connection) => {
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
		model: 'PostFavorite',
		field: 'cursor'
	});

	return db.model('PostFavorite', schema, 'PostFavorites');
};
