const config: any = require('./config');
const mongo = require('promised-mongo');
const db = mongo(config.mongoConnectionString);
const ApplicationDB = db.collection('application');

export default function(appKey: string) {
	"use-strict";
	return new Promise((resolve, reject) => {
		ApplicationDB.findOne({
			appKey
		}).then((app: Application) => {
			resolve(app !== null);
		});
	});
};
