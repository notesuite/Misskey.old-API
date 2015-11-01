import * as mongoose from 'mongoose';
import config from './config';

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

export const Application: mongoose.Model<mongoose.Document> = require('./models/application')(db);
export const AlbumFile: mongoose.Model<mongoose.Document> = require('./models/albumFile')(db);
export const AlbumFolder: mongoose.Model<mongoose.Document> = require('./models/albumFolder')(db);
export const User: mongoose.Model<mongoose.Document> = require('./models/user')(db);
export const UserFollowing: mongoose.Model<mongoose.Document> = require('./models/userFollowing')(db);
export const Post: mongoose.Model<mongoose.Document> = require('./models/user').post(db);
export const PostStatus: mongoose.Model<mongoose.Document> = require('./models/user').postStatus(db);
export const PostRepost: mongoose.Model<mongoose.Document> = require('./models/user').postRepost(db);
export const Favorite: mongoose.Model<mongoose.Document> = require('./models/favorite')(db);
