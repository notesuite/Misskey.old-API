import * as mongoose from 'mongoose';
import config from '../config';

const Schema: typeof mongoose.Schema = mongoose.Schema;

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

const schema: mongoose.Schema = new Schema({
	createdAt: { type: Date, required: true, default: Date.now },
	followeeId: { type: Schema.Types.ObjectId, required: true },
	followerId: { type: Schema.Types.ObjectId, required: true }
});

export const UserFollowing: mongoose.Model<mongoose.Document> = db.model('UserFollowing', schema, 'UserFollowings');

export interface IUserFollowing extends mongoose.Document {
	createdAt: Date;
	followeeId: mongoose.Types.ObjectId;
	followerId: mongoose.Types.ObjectId;
}
