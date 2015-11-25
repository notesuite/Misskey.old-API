import * as mongoose from 'mongoose';
import { Model, Document, Connection } from 'mongoose';
import config from './config';

const db: Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

/* tslint:disable:variable-name */
export const AlbumFile: Model<Document> = require('./models/albumFile').default(db);
export const AlbumFolder: Model<Document> = require('./models/albumFolder').default(db);
export const Application: Model<Document> = require('./models/application').default(db);
export const Hashtag: Model<Document> = require('./models/hashtag').default(db);
export const Notification: Model<Document> = require('./models/notification').default(db);
export const PhotoPost: Model<Document> = require('./models/post').photo(db);
export const Post: Model<Document> = require('./models/post').post(db);
export const PostLike: Model<Document> = require('./models/postLike').default(db);
export const PostMention: Model<Document> = require('./models/postMention').default(db);
export const Repost: Model<Document> = require('./models/post').repost(db);
export const StatusPost: Model<Document> = require('./models/post').status(db);
export const TalkMessage: Model<Document> = require('./models/talkMessage').default(db);
export const TalkHistory: Model<Document> = require('./models/talkHistory').default(db);
export const User: Model<Document> = require('./models/user').default(db);
export const UserFollowing: Model<Document> = require('./models/userFollowing').default(db);
