var config = require('./config');
var mongo = require('promised-mongo');
var db = pmongo(config.mongoConnectionString);
var Application = db.collection('application');

module.exports = (appKey: string) =>
{
	return new Promise((resolve, reject) =>
	{
		Application.findOne({
			appKey: appKey
		}).then((app) => {
			resolve(app != null);
		});
	});
};