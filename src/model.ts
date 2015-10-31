import * as mongoose from 'mongoose';
import config from './config';

const db: mongoose.Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);

export const model: mongoose.Model<mongoose.Document> = require('./models/user')(db);
