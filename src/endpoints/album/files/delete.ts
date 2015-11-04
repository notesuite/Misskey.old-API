import * as request from 'request';
import {AlbumFile, AlbumFolder} from '../../models';
import {IUser, IAlbumFile, IAlbumFolder} from '../../interfaces';
import config from '../../../config';

export default function(user: IUser, fileId: string): Promise<Object> {
	'use strict';

	return new Promise<Object>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else if (file.user.toString() !== user.id) {
				reject('file-not-found');
			} else {
				request.del({
					url: `http://${config.userContentsServer.ip}:${config.userContentsServer.port}/delete`,
					formData: {
						passkey: config.userContentsServer.passkey,
						path: file.serverPath
					}
				}, (err: any, _: any, res: any) => {
					if (err !== null) {
						return reject(err);
					}
					file.isDeleted = true;
					file.save((saveErr: any, saved: IAlbumFile) => {
						if (saveErr !== null) {
							return reject(saveErr);
						}
						resolve(saved.toObject());
					});
				});
			}
		});
	});
}
