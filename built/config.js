"use strict";
const homeDirPath = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
const configDirName = '.misskey';
const configFileName = 'api.json';
const configDirectoryPath = `${homeDirPath}/${configDirName}`;
const configPath = `${configDirectoryPath}/${configFileName}`;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loadConfig();
function loadConfig() {
    return require(configPath);
}
