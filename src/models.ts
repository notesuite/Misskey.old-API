import { Connection, Model, Document, createConnection } from 'mongoose';
import config from './config';

const db: Connection = createConnection(config.mongo.uri, config.mongo.options);

/* tslint:disable:variable-name */
export const AlbumFile: Model<Document> = require('./models/albumFile').default(db);
export const AlbumFolder: Model<Document> = require('./models/albumFolder').default(db);
export const Application: Model<Document> = require('./models/application').default(db);
export const Post: Model<Document> = require('./models/post').post(db);
export const PostFavorite: Model<Document> = require('./models/postFavorite').default(db);
export const Repost: Model<Document> = require('./models/post').repost(db);
export const Status: Model<Document> = require('./models/post').status(db);
export const TalkMessage: Model<Document> = require('./models/talkMessage').default(db);
export const TalkHistory: Model<Document> = require('./models/talkHistory').default(db);
export const User: Model<Document> = require('./models/user').default(db);
export const UserFollowing: Model<Document> = require('./models/userFollowing').default(db);
