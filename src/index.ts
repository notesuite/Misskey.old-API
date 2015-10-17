import * as fs from 'fs';
import * as config from './config';

console.log('Welcome to Misskey API');

if (fs.existsSync(config.configPath)) {
	// require('./server');
} else {
	fs.mkdirSync(config.configDirectoryPath);
	fs.writeFile(config.configPath, JSON.stringify(config.template), (writeErr: NodeJS.ErrnoException) => {
		if (writeErr) {
			console.log('configが存在しなかったため新規作成しようとしましたが、問題が発生しました:');
			console.error(writeErr);
		} else {
			console.log('configが存在しなかったため作成しました。configファイルを開き、必要事項を記入してください:');
			console.log(`ファイルパス: ${config.configPath}`);
		}
		process.exit();
	});
}
