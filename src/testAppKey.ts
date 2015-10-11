const config: any = require('./config');
const mongo = require('promised-mongo');
const db = mongo(config.mongoConnectionString);
const Application = db.collection('application');

export default function(appKey: string) {
	"use-strict";
	return new Promise((resolve, reject) => {
		Application.findOne({
			appKey
		}).then((app) => {
			resolve(app !== null);
		});
	});
};
