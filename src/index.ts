import * as fs from 'fs';
import * as config from './config';

console.log('Welcome to Misskey API');

fs.readFile(config.configPath, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
	if (err) {
		console.error(err);

		// File not found
		if (err.code === 'ENOENT') {
			const template: config.IConfig = {
				env: ''
			}

			fs.mkdirSync(config.configDirectoryPath);

			fs.writeFile(config.configPath, JSON.stringify(template), (err: NodeJS.ErrnoException) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`INFO: configが存在しなかったため作成しました。configファイルを開き、必要事項を記入してください。\r\nファイルパス: ${config.configPath}`);
				}
			});
		}
	} else {
		console.log('Loaded config');

		// require('./server');
	}
});
