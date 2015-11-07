import { Connection, Model, Document, createConnection } from 'mongoose';
import config from './config';

const db: Connection = createConnection(config.mongo.uri, config.mongo.options);

/* tslint:disable:variable-name */
export const Application: Model<Document> = require('./models/application')(db);
export const AlbumFile: Model<Document> = require('./models/albumFile')(db);
export const AlbumFolder: Model<Document> = require('./models/albumFolder')(db);
export const User: Model<Document> = require('./models/user')(db);
export const UserFollowing: Model<Document> = require('./models/userFollowing')(db);
export const Post: Model<Document> = require('./models/post').post(db);
export const Status: Model<Document> = require('./models/post').status(db);
export const Repost: Model<Document> = require('./models/post').repost(db);
export const PostFavorite: Model<Document> = require('./models/postFavorite')(db);
