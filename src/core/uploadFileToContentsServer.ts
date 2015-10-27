import * as request from 'request';
import {AlbumFile, IAlbumFile} from '../models/albumFile';
import {IApplication} from '../models/application';
import config from '../config';

export default function(fileName: string, file: Buffer)
		: Promise<Object> {
	'use strict';

	return new Promise((resolve: (status: Object) => void, reject: (err: any) => void) => {
		const requestData: Object = {
			passkey: config.userContentsServerPasskey,
			file: {
				value: Buffer,
				options: {
					filename: fileName
				}
			}
		};

		const url = `http://${config.imageServerIp}:${config.imageServerPort}/register`;
		request.post({
			url: url,
			formData: requestData
		}, (err, res, path) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(path);
			}
		});
	});
}
