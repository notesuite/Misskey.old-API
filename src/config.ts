const homeDirPath: string = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
const configDirName = '.misskey';
const configFileName = 'api.json';
const configDirectoryPath = `${homeDirPath}/${configDirName}`;
const configPath = `${configDirectoryPath}/${configFileName}`;

export default loadConfig();

function loadConfig(): IConfig {
	return <IConfig>require(configPath);
}

export interface IConfig {
	mongo: {
		uri: string,
		options: {
			user: string,
			pass: string
		}
	};
	redis: {
		host: string,
		port: number,
		password: string;
	};
	fileServer: {
		passkey: string,
		url: string,
		ip: string,
		port: number
	};
	apiPasskey: string;
	port: {
		internal: number,
		http: number,
		https: number
	};
	https: {
		enable: boolean;
		keyPath: string;
		certPath: string;
	};
}
