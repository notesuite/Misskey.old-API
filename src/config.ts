export const homeDirPath: string = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
export const configDirName: string = '.misskey';
export const configFileName: string = 'api.json';
export const configDirectoryPath: string = `${homeDirPath}/${configDirName}`;
export const configPath: string = `${configDirectoryPath}/${configFileName}`;

export default <IConfig>require(configPath);

export interface IConfig {
	env: string;
	mongo: {
		uri: string;
		options: {
			user: string;
			pass: string;
		};
	};
}

export const template: IConfig = {
	env: "",
	mongo: {
		uri: "",
		options: {
			user: "",
			pass: ""
		}
	}
};
