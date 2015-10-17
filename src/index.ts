import * as config from './config';

config.initConfigLoader().then((conf: config.IConfig) => {
	console.log(conf);
});