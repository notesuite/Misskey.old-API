import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
const mongooseAutoIncrement: any = require('mongoose-auto-increment');
const config: any = require('../config');

const db: Connection = mongoose.createConnection(config.mongo.uri, config.mongo.options);
mongooseAutoIncrement.initialize(db);
