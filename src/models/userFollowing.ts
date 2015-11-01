import * as mongoose from 'mongoose';
// import mongooseAutoIncrement from 'mongoose-auto-increment';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

export default (db: mongoose.Connection) => {
	mongooseAutoIncrement.initialize(db);

	const schema: mongoose.Schema = new Schema({
		createdAt: { type: Date, required: true, default: Date.now },
		cursor: { type: Number },
		followee: { type: Schema.Types.ObjectId, required: true },
		follower: { type: Schema.Types.ObjectId, required: true }
	});

	// Auto increment
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'UserFollowing',
		field: 'cursor'
	});

	return db.model('UserFollowing', schema, 'UserFollowings');
}
