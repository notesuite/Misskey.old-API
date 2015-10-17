import * as fs from 'fs';
import * as config from './config';

console.log('Welcome to Misskey API');

fs.readFile(config.configPath, 'utf8', function (err: NodeJS.ErrnoException, data: string) {
	if (err) {
		console.error(err);
	} else {
		console.log('Loaded config');
		console.log(data);
	}
});
