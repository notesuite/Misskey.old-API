import * as mongoose from 'mongoose';
import config from './config';

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

export const User: mongoose.Model<mongoose.Document> = require('./models/user')(db);
