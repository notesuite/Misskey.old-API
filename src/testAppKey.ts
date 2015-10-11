const config: any = require('./config');
const mongo: any = require('promised-mongo');
const db: any = mongo(config.mongoConnectionString);
const ApplicationDB: any = db.collection('application');

export default function(appKey: string): Promise<boolean> {
	'use strict';
	return new Promise((resolve: (value: boolean) => void, reject: (err: any) => void) => {
		ApplicationDB.findOne({
			appKey
		}).then((app: Application) => {
			resolve(app !== null);
		});
	});
};
