/**
 * Path of home directory
 */
export const homeDirPath: string = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

/**
 * Name of config directory
 */
export const configDirName: string = '.misskey';

/**
 * Name of config file
 */
export const configFileName: string = 'api.json';

/**
 * Full path of config file
 */
export const configPath: string = `${homeDirPath}/${configDirName}/${configFileName}`;

export default <IConfig>require(`${homeDirPath}/.misskey/api.json`);

export interface IConfig {
	env: string;
}
