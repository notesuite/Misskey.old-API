var config = require('./config');
var mongo = require('promised-mongo');
var db = mongo(config.mongoConnectionString);
var Application = db.collection('application');

module.exports = (appKey: string) =>
{
	return new Promise((resolve, reject) =>
	{
		Application.findOne({
			appKey
		}).then((app) => {
			resolve(app != null);
		});
	});
};