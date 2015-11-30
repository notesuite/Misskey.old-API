export const homeDirPath: string = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
export const configDirName = '.misskey';
export const configFileName = 'api.json';
export const configDirectoryPath = `${homeDirPath}/${configDirName}`;
export const configPath = `${configDirectoryPath}/${configFileName}`;

export default loadConfig();

function loadConfig(): IConfig {
	'use strict';
	try {
		return <IConfig>require(configPath);
	} catch (e) {
		return null;
	}
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
		port: number
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
}

export const defaultConfig: IConfig = {
	mongo: {
		uri: 'mongodb://localhost/Misskey',
		options: {
			user: 'himawari',
			pass: 'sakurako0907'
		}
	},
	redis: {
		host: 'localhost',
		port: 6379
	},
	fileServer: {
		passkey: '',
		url: 'http://usercontents.misskey.xyz',
		ip: '192.168.0.2',
		port: 616
	},
	apiPasskey: '',
	port: {
		internal: 616,
		http: 80,
		https: 443
	}
};
