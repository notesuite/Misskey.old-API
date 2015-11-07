export const homeDirPath: string = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
export const configDirName: string = '.misskey';
export const configFileName: string = 'api.json';
export const configDirectoryPath: string = `${homeDirPath}/${configDirName}`;
export const configPath: string = `${configDirectoryPath}/${configFileName}`;

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
	userContentsServer: {
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
	userContentsServer: {
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
