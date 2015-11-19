import * as mongoose from 'mongoose';
import config from './config';

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

/* tslint:disable:variable-name */
export const AlbumFile: mongoose.Model<mongoose.Document> = require('./models/albumFile').default(db);
export const AlbumFolder: mongoose.Model<mongoose.Document> = require('./models/albumFolder').default(db);
export const Application: mongoose.Model<mongoose.Document> = require('./models/application').default(db);
export const PhotoPost: mongoose.Model<mongoose.Document> = require('./models/post').photo(db);
export const Post: mongoose.Model<mongoose.Document> = require('./models/post').post(db);
export const PostLike: mongoose.Model<mongoose.Document> = require('./models/postLike').default(db);
export const PostMention: mongoose.Model<mongoose.Document> = require('./models/postMention').default(db);
export const Repost: mongoose.Model<mongoose.Document> = require('./models/post').repost(db);
export const StatusPost: mongoose.Model<mongoose.Document> = require('./models/post').status(db);
export const TalkMessage: mongoose.Model<mongoose.Document> = require('./models/talkMessage').default(db);
export const TalkHistory: mongoose.Model<mongoose.Document> = require('./models/talkHistory').default(db);
export const User: mongoose.Model<mongoose.Document> = require('./models/user').default(db);
export const UserFollowing: mongoose.Model<mongoose.Document> = require('./models/userFollowing').default(db);
