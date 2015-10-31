import * as mongoose from 'mongoose';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

const schema: mongoose.Schema = new Schema({
	createdAt: { type: Date, required: true, default: Date.now },
	followee: { type: Schema.Types.ObjectId, required: true },
	follower: { type: Schema.Types.ObjectId, required: true }
});

export const UserFollowing: mongoose.Model<mongoose.Document> = db.model('UserFollowing', schema, 'UserFollowings');
