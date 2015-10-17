import * as fs from 'fs';
import * as config from './config';

console.log('Welcome to Misskey API');

fs.readFile(config.configPath, 'utf8', (readErr: NodeJS.ErrnoException, data: string) => {
	if (readErr) {
		console.error(readErr);

		// File not found
		if (readErr.code === 'ENOENT') {
			const template: config.IConfig = {
				env: ''
			};

			fs.mkdirSync(config.configDirectoryPath);

			fs.writeFile(config.configPath, JSON.stringify(template), (writeErr: NodeJS.ErrnoException) => {
				if (writeErr) {
					console.error(writeErr);
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
