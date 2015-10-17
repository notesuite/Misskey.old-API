const homeDirPath = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

export default <IConfig>require(`${homeDirPath}/.misskey/api.json`);

export interface IConfig {
	env: string;
}

export function initConfigLoader(): Promise<IConfig> {
	'use strict';
	return new Promise((resolve: (value: IConfig) => void, reject: (err: any) => void) => {
		//
		// Hoge
		//
		resolve(<IConfig>require(`${homeDirPath}/.misskey/api.json`));
	});
}
