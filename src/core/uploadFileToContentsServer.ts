import * as request from 'request';
import {AlbumFile, IAlbumFile} from '../models/albumFile';
import {IApplication} from '../models/application';
import config from '../config';

export default function(fileName: string, file: Buffer)
		: Promise<string> {
	'use strict';

	return new Promise((resolve: (path: string) => void, reject: (err: any) => void) => {
		const requestData: Object = {
			passkey: config.userContentsServer.passkey,
			file: {
				value: Buffer,
				options: {
					filename: fileName
				}
			}
		};

		const url = `http://${config.userContentsServer.ip}:${config.userContentsServer.port}/register`;
		request.post({
			url,
			formData: requestData
		}, (err: any, _: any, path: any) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(path);
			}
		});
	});
}
