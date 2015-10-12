import { Application } from './models/application';
const config: any = require('./config');
const mongo: any = require('promised-mongo');
const db: any = mongo(config.mongoConnectionString);
const ApplicationDB: any = db.collection('application');

export default function(appKey: string): Promise<boolean> {
	'use strict';
	return ApplicationDB.findOne({appKey}).then((app: Application) => app !== null);
};
