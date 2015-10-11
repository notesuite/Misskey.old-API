const config: any = require('./config');
const mongo = require('promised-mongo');
const db = mongo(config.mongoConnectionString);
const ApplicationDB = db.collection('application');

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
